/* eslint-disable no-param-reassign, no-undef, no-var, func-names, prefer-arrow-callback, prefer-template, object-shorthand, vars-on-top */

const config = mocha.env && /test/.test(mocha.env.NODE_ENV) ? FIREBASE_CLIENT_TEST_CONFIG : FIREBASE_CLIENT_DEV_CONFIG;

const storage = firebase.storage(firebase.initializeApp(config));


/* ************************************************************ */


firebase.database.enableLogging(false);


/* ************************************************************ */


var user = { uid: null };


const test = function (name, path, type, r, w) {
  it(name + ' ' + type + ' ' + (r ? '' : '!') + 'READ', function (done) {
    path = path.replace('{user}', user.uid);

    if (r) {
      storage
      .ref(path)
      .getDownloadURL()
      .then(function (url) {
        expect(url).to.be.a('string');
        done();
      })
      .catch(function (err) {
        expect(err.code).to.equal('storage/object-not-found');
        done();
      });
    } else {
      storage
      .ref(path)
      .getDownloadURL()
      .catch(function (err) {
        expect(err.code).to.equal('storage/unauthorized');
        done();
      });
    }
  });

  it(name + ' ' + type + ' ' + (w ? '' : '!') + 'WRITE', function (done) {
    path = path.replace('{user}', user.uid);

    if (w) {
      storage
      .ref(path)
      .put(new Blob([0], { type: type }))
      .on(firebase.storage.TaskEvent.STATE_CHANGED, null, null, done);
    } else {
      storage
      .ref(path)
      .put(new Blob([0], { type: type }))
      .on(firebase.storage.TaskEvent.STATE_CHANGED, null, function (err) {
        expect(err.code).to.equal('storage/unauthorized');
        done();
      }, null);
    }
  });
};


/* ************************************************************ */


describe('storage', function () {
  const note = ('' + Date.now()).slice(-9);
  const file = ('' + Date.now()).slice(-9) + '.png';


  describe('user:unauthenticated', function () {
    before(function (done) {
      helper.logout()
      .then(function () {
        user = { uid: null };
        done();
      });
    });


    test('/notes/{user}/{note}/' + file + ' owner:no ', '/notes/123456789/' + note + '/' + file, 'image/png');
  });


  describe('user:anonymous:0', function () {
    before(function (done) {
      helper.login(null, null)
      .then(function ($user) {
        user = $user;
        done();
      });
    });

    after(function () {
      return user.delete();
    });


    test('/notes/{user}/{note}/' + file + ' owner:no ', '/notes/123456789/' + note + '/' + file, 'image/png');
    test('/notes/{user}/{note}/' + file + ' owner:yes', '/notes/{user}/' + note + '/' + file, 'image/png');
  });


  describe('user:authenticated:1', function () {
    before(function (done) {
      helper.login('1@test.user.com', '123456789')
      .then(function ($user) {
        user = $user;
        done();
      });
    });

    after(function () {
      return user.delete();
    });


    test('/notes/{user}/{note}/' + file + ' owner:no ', '/notes/123456789/' + note + '/' + file, 'image/png');
    test('/notes/{user}/{note}/' + file + ' owner:yes', '/notes/{user}/' + note + '/' + file, 'text/plain', true, false);
    test('/notes/{user}/{note}/' + file + ' owner:yes', '/notes/{user}/' + note + '/' + file, 'image/png', true, true);
  });
});
