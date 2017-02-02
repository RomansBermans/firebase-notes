/* eslint-disable no-param-reassign, no-undef, no-unused-expressions */


const config = mocha.env && /test/.test(mocha.env.NODE_ENV) ? FIREBASE_CLIENT_TEST_CONFIG : FIREBASE_CLIENT_DEV_CONFIG;


/* ************************************************************ */


const database = firebase.database(firebase.initializeApp(config));

firebase.database.enableLogging(false);


const expect = chai.expect;

mocha.ui('bdd');
mocha.slow(500);
mocha.timeout(5000);


/* ************************************************************ */


let user = { uid: 'u@' };

const test = {
  fail: {
    read: path =>
      it(`- READ   ${path()}`, done => {
        database
        .ref(path())
        .once('value')
        .catch(() => done());
      }),
    create: (path, data) =>
      it(`- CREATE ${path()}`, done => {
        database
        .ref(path())
        .set(data())
        .catch(() => done());
      }),
    update: (path, data) =>
      it(`- UPDATE ${path()} \u2192 ${Object.keys(data()).join(', ')}`, done => {
        database
        .ref(path())
        .update(data())
        .catch(() => done());
      }),
    delete: path =>
      it(`- DELETE ${path()}`, done => {
        database
        .ref(path())
        .remove()
        .catch(() => done());
      }),
  },
  pass: {
    read: (path, cb) =>
      it(`+ READ   ${path()}`, done => {
        database
        .ref(path())
        .once('value')
        .then($value => {
          expect($value).not.to.be.null;
          cb && cb($value);
          done();
        });
      }),
    create: (path, data) =>
      it(`+ CREATE ${path()}`, done => {
        database
        .ref(path())
        .set(data())
        .then(done)
        .catch(done);
      }),
    update: (path, data) =>
      it(`+ UPDATE ${path()} \u2192 ${Object.keys(data()).join(', ')}`, done => {
        database
        .ref(path())
        .update(data())
        .then(done)
        .catch(done);
      }),
    delete: path =>
      it(`+ DELETE ${path()}`, done => {
        database
        .ref(path())
        .remove()
        .then(done)
        .catch(done);
      }),
  },
};


/* ************************************************************ */


describe(`test:client \u2192 ${config.databaseURL}`, () => {
  before(done => {
    helper.login('u1@test.user.com', '123456789')
    .then($user => {
      user = $user;

      return database
      .ref()
      .update({
        '/public/p1': helper.data.model.public({ user }),
        '/public/p2': helper.data.model.public({ user, visibility: 'authenticated' }),
        '/public/p3': helper.data.model.public({ user, visibility: 'public' }),
        [`/notes/${user.uid}/n1`]: helper.data.model.note({ user }),
      });
    })
    .then(() => done());
  });

  describe('user:unauthenticated', () => {
    before(done => {
      helper.logout()
      .then(() => {
        user = { uid: null };
        done();
      });
    });


    test.fail.read(() => '/public/p1');
    test.fail.read(() => '/public/p2');
    test.pass.read(() => '/public/p3');


    test.fail.read(() => '/notes');
    test.fail.delete(() => '/notes');
  });


  describe('user:anonymous', () => {
    before(done => {
      helper.login(null, null)
      .then($user => {
        user = $user;
        done();
      });
    });

    after(() =>
      user.delete()
    );


    test.fail.read(() => '/public/p1');
    test.fail.read(() => '/public/p2');
    test.pass.read(() => '/public/p3');


    test.fail.read(() => '/notes');
    test.fail.delete(() => '/notes');

    test.fail.read(() => `/notes/${user.uid}`);
    test.fail.delete(() => `/notes/${user.uid}`);

    test.fail.read(() => `/notes/${user.uid}/n1`);
    test.fail.create(() => `/notes/${user.uid}/n1`, () => helper.data.model.note({ user }));
    test.fail.delete(() => `/notes/${user.uid}/n1`);
  });


  describe('user:authenticated:0', () => {
    before(done => {
      helper.login('u0@test.user.com', '123456789')
      .then($user => {
        user = $user;
        done();
      });
    });

    after(() =>
      user.delete()
    );


    test.fail.read(() => '/public/p1');
    test.pass.read(() => '/public/p2');
    test.pass.read(() => '/public/p3');


    test.fail.read(() => '/notes');
    test.fail.delete(() => '/notes');

    test.pass.read(() => `/notes/${user.uid}`);
    test.fail.delete(() => `/notes/${user.uid}`);

    test.pass.read(() => `/notes/${user.uid}/n1`);
    test.pass.create(() => `/notes/${user.uid}/n1`, () => helper.data.model.note({ user }));
    test.pass.delete(() => `/notes/${user.uid}/n1`);
  });


  describe('user:authenticated:1', () => {
    before(done => {
      helper.login('u1@test.user.com', '123456789')
      .then($user => {
        user = $user;
        done();
      });
    });

    after(() =>
      user.delete()
    );


    test.pass.read(() => '/public/p1');
    test.pass.read(() => '/public/p2');
    test.pass.read(() => '/public/p3');

    test.pass.delete(() => '/public/p1');
    test.pass.delete(() => '/public/p2');
    test.pass.delete(() => '/public/p3');


    test.pass.read(() => `/notes/${user.uid}/n1`);
    test.fail.create(() => `/notes/${user.uid}/n1`, () => helper.data.model.note({ user }));
    test.fail.update(() => `/notes/${user.uid}/n1`, () => ({ created: helper.data.timestamp }));
    test.pass.update(() => `/notes/${user.uid}/n1`, () => ({ modified: helper.data.timestamp }));
    test.fail.update(() => `/notes/${user.uid}/n1`, () => ({ creator: 'u0' }));
    test.pass.update(() => `/notes/${user.uid}/n1`, () => ({ creator: user.uid }));
    test.fail.update(() => `/notes/${user.uid}/n1`, () => ({ title: '' }));
    test.pass.update(() => `/notes/${user.uid}/n1`, () => ({ title: 'Title' }));
    test.fail.update(() => `/notes/${user.uid}/n1`, () => ({ visibility: 'private' }));
    test.pass.update(() => `/notes/${user.uid}/n1`, () => ({ visibility: 'authenticated' }));
    test.pass.update(() => `/notes/${user.uid}/n1`, () => ({ visibility: 'public' }));
    test.pass.delete(() => `/notes/${user.uid}/n1`);
  });
});
