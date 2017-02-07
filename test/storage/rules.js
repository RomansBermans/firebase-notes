/* eslint-disable no-param-reassign, no-undef */


const expect = chai.expect;

mocha.ui('bdd');
mocha.slow(2000);
mocha.timeout(10000);


const config = mocha.env && /test/.test(mocha.env.NODE_ENV) ? FIREBASE_CLIENT_TEST_CONFIG : FIREBASE_CLIENT_DEV_CONFIG;
const storage = firebase.storage(firebase.initializeApp(config));


/* ************************************************************ */


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
  describe('/notes', () => {
    let user = { uid: 'u@' };
    let u1 = 'u1';


    before(done => {
      helper.login('u1@test.user.com', '123456789')
      .then($user => {
        user = $user;
        u1 = user.uid;

        return Promise.all([
          storage
          .ref(`/notes/${user.uid}/n1/123456789.png`)
          .put(new Blob([Date.now()], { type: 'image/png' }), { customMetadata: { creator: user.uid } }),
          storage
          .ref(`/notes/${user.uid}/n2/123456789.png`)
          .put(new Blob([Date.now()], { type: 'image/png' }), { customMetadata: { creator: user.uid, visibility: 'authenticated' } }),
          storage
          .ref(`/notes/${user.uid}/n3/123456789.png`)
          .put(new Blob([Date.now()], { type: 'image/png' }), { customMetadata: { creator: user.uid, visibility: 'public' } }),
        ]);
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


      test.fail.read(() => '/notes');
      test.fail.delete(() => '/notes');


      test.fail.read(() => `/notes/${u1}/n1/123456789.png`);
      test.fail.read(() => `/notes/${u1}/n2/123456789.png`);
      test.pass.read(() => `/notes/${u1}/n3/123456789.png`);
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


      test.fail.read(() => '/notes');
      test.fail.delete(() => '/notes');

      test.fail.read(() => `/notes/${user.uid}`);
      test.fail.delete(() => `/notes/${user.uid}`);

      test.fail.read(() => `/notes/${user.uid}/n1/123456789.png`);
      test.fail.write(() => `/notes/${user.uid}/n1/123456789.png`, 'image/png');
      test.fail.delete(() => `/notes/${user.uid}/n1/123456789.png`);


      test.fail.read(() => `/notes/${u1}/n1/123456789.png`);
      test.fail.read(() => `/notes/${u1}/n2/123456789.png`);
      test.pass.read(() => `/notes/${u1}/n3/123456789.png`);
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


      test.fail.read(() => '/notes');
      test.fail.delete(() => '/notes');

      test.fail.read(() => `/notes/${user.uid}`);
      test.fail.delete(() => `/notes/${user.uid}`);

      test.pass.read(() => `/notes/${user.uid}/n1/123456789.png`);
      test.pass.write(() => `/notes/${user.uid}/n1/123456789.png`, 'image/png');
      test.pass.delete(() => `/notes/${user.uid}/n1/123456789.png`);


      test.fail.read(() => `/notes/${u1}/n1/123456789.png`);
      test.pass.read(() => `/notes/${u1}/n2/123456789.png`);
      test.pass.read(() => `/notes/${u1}/n3/123456789.png`);
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


      test.pass.read(() => `/notes/${user.uid}/n1/123456789.png`);
      test.fail.write(() => `/notes/${user.uid}/n1/123456789.png`, 'text/plain');
      test.fail.write(() => `/notes/${user.uid}/n1/123456789.png`, 'image/png');
      test.pass.meta(() => `/notes/${user.uid}/n1/123456789.png`, () => ({ contentType: 'image/png' }));
      test.pass.meta(() => `/notes/${user.uid}/n1/123456789.png`, () => ({ private: true }));
      test.pass.meta(() => `/notes/${user.uid}/n1/123456789.png`, () => ({ private: null }));
      test.pass.meta(() => `/notes/${user.uid}/n1/123456789.png`, () => ({ customMetadata: { private: 'true' } }));
      test.fail.meta(() => `/notes/${user.uid}/n1/123456789.png`, () => ({ customMetadata: { visibility: 'private' } }));
      test.pass.meta(() => `/notes/${user.uid}/n1/123456789.png`, () => ({ customMetadata: { visibility: 'authenticated' } }));
      test.pass.meta(() => `/notes/${user.uid}/n1/123456789.png`, () => ({ customMetadata: { visibility: 'public' } }));
      test.pass.meta(() => `/notes/${user.uid}/n1/123456789.png`, () => ({ customMetadata: { visibility: null } }));


      test.pass.read(() => `/notes/${u1}/n1/123456789.png`);
      test.pass.read(() => `/notes/${u1}/n2/123456789.png`);
      test.pass.read(() => `/notes/${u1}/n3/123456789.png`);

      test.pass.delete(() => `/notes/${u1}/n1/123456789.png`);
      test.pass.delete(() => `/notes/${u1}/n2/123456789.png`);
      test.pass.delete(() => `/notes/${u1}/n3/123456789.png`);
    });
  });

  describe('/notes-direct', () => {
    let user = { uid: 'u@' };


    before(done => {
      helper.login('u1@test.user.com', '123456789')
      .then($user => {
        user = $user;

        return Promise.all([
          storage
          .ref('/notes-direct/n1/123456789.png')
          .put(new Blob([Date.now()], { type: 'image/png' }), { customMetadata: { creator: user.uid } }),
          storage
          .ref('/notes-direct/n2/123456789.png')
          .put(new Blob([Date.now()], { type: 'image/png' }), { customMetadata: { creator: user.uid, visibility: 'authenticated' } }),
          storage
          .ref('/notes-direct/n3/123456789.png')
          .put(new Blob([Date.now()], { type: 'image/png' }), { customMetadata: { creator: user.uid, visibility: 'public' } }),
        ]);
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


      test.fail.read(() => '/notes-direct/n1/123456789.png');
      test.fail.read(() => '/notes-direct/n2/123456789.png');
      test.pass.read(() => '/notes-direct/n3/123456789.png');
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


      test.fail.read(() => '/notes-direct/n1/123456789.png');
      test.fail.read(() => '/notes-direct/n2/123456789.png');
      test.pass.read(() => '/notes-direct/n3/123456789.png');
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


      test.fail.read(() => '/notes-direct/n1/123456789.png');
      test.pass.read(() => '/notes-direct/n2/123456789.png');
      test.pass.read(() => '/notes-direct/n3/123456789.png');
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


      test.pass.read(() => '/notes-direct/n1/123456789.png');
      test.pass.read(() => '/notes-direct/n2/123456789.png');
      test.pass.read(() => '/notes-direct/n3/123456789.png');

      test.pass.delete(() => '/notes-direct/n1/123456789.png');
      test.pass.delete(() => '/notes-direct/n2/123456789.png');
      test.pass.delete(() => '/notes-direct/n3/123456789.png');
    });
  });
});
