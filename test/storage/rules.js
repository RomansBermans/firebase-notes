/* eslint-disable no-param-reassign, no-undef */


const config = mocha.env && /test/.test(mocha.env.NODE_ENV) ? FIREBASE_CLIENT_TEST_CONFIG : FIREBASE_CLIENT_DEV_CONFIG;


/* ************************************************************ */


const storage = firebase.storage(firebase.initializeApp(config));

firebase.database.enableLogging(false);


const expect = chai.expect;

mocha.ui('bdd');
mocha.slow(1000);
mocha.timeout(10000);


/* ************************************************************ */


let user = { uid: 'u@' };

const test = {
  fail: {
    read: path =>
      it(`- READ   ${path()}`, done => {
        storage
        .ref(path())
        .getDownloadURL()
        .catch(err => {
          expect(err.code).to.equal('storage/unauthorized');
          done();
        });
      }),
    write: (path, type, meta = () => ({})) =>
      it(`- WRITE  ${path()} ${type}`, done => {
        storage
        .ref(path())
        .put(new Blob([Date.now()], { type }), meta())
        .on(firebase.storage.TaskEvent.STATE_CHANGED, null, err => {
          expect(err.code).to.equal('storage/unauthorized');
          done();
        }, null);
      }),
    delete: path =>
      it(`- DELETE ${path()}`, done => {
        storage
        .ref(path())
        .delete()
        .catch(err => {
          expect(err.code).to.equal('storage/unauthorized');
          done();
        });
      }),
    meta: (path, meta) =>
      it(`- META   ${path()}`, done => {
        storage
        .ref(path())
        .updateMetadata(meta())
        .catch(err => {
          expect(err.code).to.equal('storage/unauthorized');
          done();
        });
      }),
  },
  pass: {
    read: path =>
      it(`+ READ   ${path()}`, done => {
        storage
        .ref(path())
        .getDownloadURL()
        .then(url => {
          expect(url).to.be.a('string');
          done();
        })
        .catch(err => {
          expect(err.code).to.equal('storage/object-not-found');
          done();
        });
      }),
    write: (path, type, meta = () => ({})) =>
      it(`+ WRITE  ${path()} ${type}`, done => {
        storage
        .ref(path())
        .put(new Blob([Date.now()], { type }), meta())
        .on(firebase.storage.TaskEvent.STATE_CHANGED, null, done, done);
      }),
    delete: path =>
      it(`+ DELETE ${path()}`, done => {
        storage
        .ref(path())
        .delete()
        .then(done)
        .catch(err => {
          expect(err.code).to.equal('storage/object-not-found');
          done();
        });
      }),
    meta: (path, meta) =>
      it(`+ META   ${path()}`, done => {
        storage
        .ref(path())
        .updateMetadata(meta())
        .then(() => done());
      }),
  },
};


/* ************************************************************ */

describe(`test:storage \u2192 ${config.storageBucket}`, () => {
  describe('user:unauthenticated', () => {
    before(done => {
      helper.logout()
      .then(() => {
        user = { uid: null };
        done();
      });
    });


    const image = `${`${Date.now()}`.slice(-9)}.png`;


    test.fail.write(() => `/public/${image}`, 'image/png', () => ({ customMetadata: { creator: user.uid } }));
    test.fail.read(() => `/public/${image}`);
    test.fail.delete(() => `/public/${image}`);
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


    const image = `${`${Date.now()}`.slice(-9)}.png`;


    test.fail.write(() => `/public/${image}`, 'image/png', () => ({ customMetadata: { creator: user.uid } }));
    test.fail.read(() => `/public/${image}`);
    test.fail.delete(() => `/public/${image}`);


    test.fail.read(() => `/notes/${user.uid}/n1/${image}`);
    test.fail.write(() => `/notes/${user.uid}/n1/${image}`, 'image/png');
    test.fail.delete(() => `/notes/${user.uid}/n1/${image}`);
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


    const image = `${`${Date.now()}`.slice(-9)}.png`;


    test.pass.write(() => `/public/${image}`, 'image/png', () => ({ customMetadata: { creator: user.uid } }));
    test.pass.read(() => `/public/${image}`);
    test.pass.delete(() => `/public/${image}`);


    test.pass.read(() => `/notes/${user.uid}/n1/${image}`);
    test.pass.write(() => `/notes/${user.uid}/n1/${image}`, 'image/png');
    test.pass.delete(() => `/notes/${user.uid}/n1/${image}`);
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


    const image = `${`${Date.now()}`.slice(-9)}.png`;


    test.pass.read(() => `/notes/${user.uid}/n1/${image}`);
    test.fail.write(() => `/notes/${user.uid}/n1/${image}`, 'text/plain');
    test.pass.write(() => `/notes/${user.uid}/n1/${image}`, 'image/png');
    test.fail.write(() => `/notes/${user.uid}/n1/${image}`, 'image/png');
    test.pass.meta(() => `/notes/${user.uid}/n1/${image}`, () => ({ contentType: 'image/png' }));
    test.fail.meta(() => `/notes/${user.uid}/n1/${image}`, () => ({ customMetadata: { visibility: 'private' } }));
    test.pass.meta(() => `/notes/${user.uid}/n1/${image}`, () => ({ customMetadata: { visibility: 'authenticated' } }));
    test.pass.meta(() => `/notes/${user.uid}/n1/${image}`, () => ({ customMetadata: { visibility: 'public' } }));
    test.pass.meta(() => `/notes/${user.uid}/n1/${image}`, () => ({ customMetadata: { private: 'true' } }));
    test.pass.delete(() => `/notes/${user.uid}/n1/${image}`);

    test.pass.write(() => `/notes/${user.uid}/n1/${image}`, 'image/png', () => ({ customMetadata: { visibility: 'public' } }));
    test.pass.delete(() => `/notes/${user.uid}/n1/${image}`);

    test.pass.write(() => `/notes/${user.uid}/n1/${image}`, 'image/png', () => ({ customMetadata: { private: 'true' } }));
    test.pass.delete(() => `/notes/${user.uid}/n1/${image}`);

    test.fail.read(() => `/notes/u2/n1/${image}`);
    test.fail.write(() => `/notes/u2/n1/${image}`, 'image/png');
    test.fail.delete(() => `/notes/u2/n1/${image}`);
  });


  describe('user:authenticated:1', () => {
    before(done => {
      helper.login('u1@test.user.com', '123456789')
      .then($user => {
        user = $user;
        done();
      });
    });


    test.pass.write(() => '/public/123456789.1.png', 'image/png', () => ({ customMetadata: { creator: user.uid } }));
    test.pass.write(() => '/public/123456789.2.png', 'image/png', () => ({ customMetadata: { creator: user.uid, visibility: 'authenticated' } }));
    test.pass.write(() => '/public/123456789.3.png', 'image/png', () => ({ customMetadata: { creator: user.uid, visibility: 'public' } }));
  });

  describe('user:unauthenticated', () => {
    before(done => {
      helper.logout()
      .then(() => {
        user = { uid: null };
        done();
      });
    });


    test.fail.read(() => '/public/123456789.1.png');
    test.fail.read(() => '/public/123456789.2.png');
    test.pass.read(() => '/public/123456789.3.png');

    test.fail.delete(() => '/public/123456789.1.png');
    test.fail.delete(() => '/public/123456789.2.png');
    test.fail.delete(() => '/public/123456789.3.png');
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


    test.fail.read(() => '/public/123456789.1.png');
    test.fail.read(() => '/public/123456789.2.png');
    test.pass.read(() => '/public/123456789.3.png');

    test.fail.delete(() => '/public/123456789.1.png');
    test.fail.delete(() => '/public/123456789.2.png');
    test.fail.delete(() => '/public/123456789.3.png');
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


    test.fail.read(() => '/public/123456789.1.png');
    test.pass.read(() => '/public/123456789.2.png');
    test.pass.read(() => '/public/123456789.3.png');

    test.fail.delete(() => '/public/123456789.1.png');
    test.fail.delete(() => '/public/123456789.2.png');
    test.fail.delete(() => '/public/123456789.3.png');
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


    test.pass.read(() => '/public/123456789.1.png');
    test.pass.read(() => '/public/123456789.2.png');
    test.pass.read(() => '/public/123456789.3.png');

    test.pass.delete(() => '/public/123456789.1.png');
    test.pass.delete(() => '/public/123456789.2.png');
    test.pass.delete(() => '/public/123456789.3.png');
  });
});
