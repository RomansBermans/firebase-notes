/* */


const helper = require('../helper');


const chai = require('chai');
const mocha = require('mocha');

const { expect } = chai;


const firebase = require('firebase');
const config = require('../../environment/config')[mocha.env && /test/.test(mocha.env.NODE_ENV) ? 'test' : 'dev'];

const database = firebase.database(firebase.initializeApp(config));

firebase.database.enableLogging(false);

process.stderr.write = (write =>
  (...args) => {
    if (!args[0].startsWith('FIREBASE WARNING')) {
      write.apply(process.stderr, args);
    }
  })(process.stderr.write);


/* ************************************************************ */


const test = {
  fail: {
    read: path =>
      it(`- READ   ${path()}`, async () => {
        try {
          await database.ref(path()).once('value');
          expect.fail();
        } catch (err) {
          expect(err).to.exist;
        }
      }),
    create: (path, data) =>
      it(`- CREATE ${path()}`, async () => {
        try {
          await database.ref(path()).set(data());
          expect.fail();
        } catch (err) {
          expect(err).to.exist;
        }
      }),
    update: (path, data) =>
      it(`- UPDATE ${path()} \u2192 ${Object.keys(data()).join(', ')}`, async () => {
        try {
          await database.ref(path()).update(data());
          expect.fail();
        } catch (err) {
          expect(err).to.exist;
        }
      }),
    delete: path =>
      it(`- DELETE ${path()}`, async () => {
        try {
          await database.ref(path()).remove();
          expect.fail();
        } catch (err) {
          expect(err).to.exist;
        }
      }),
  },
  pass: {
    read: (path, cb) =>
      it(`+ READ   ${path()}`, async () => {
        const value = await database.ref(path()).once('value');
        expect(value).not.to.be.null;
        cb && cb(value);
      }),
    create: (path, data) =>
      it(`+ CREATE ${path()}`, async () => {
        await database.ref(path()).set(data());
      }),
    update: (path, data) =>
      it(`+ UPDATE ${path()} \u2192 ${Object.keys(data()).join(', ')}`, async () => {
        await database.ref(path()).update(data());
      }),
    delete: path =>
      it(`+ DELETE ${path()}`, async () => {
        await database.ref(path()).remove();
      }),
  },
};


/* ************************************************************ */


describe(`test:app \u2192 ${config.databaseURL}`, () => {
  describe('/notes', () => {
    let user = { uid: 'u1' };
    let u1 = 'u1';


    before(async () => {
      user = await helper.login('u1@test.user.com', '123456789');
      u1 = user.uid;

      await database
        .ref()
        .update({
          [`/notes/${user.uid}/n1`]: helper.data.model.note({ user }),
          [`/notes/${user.uid}/n2`]: helper.data.model.note({ user, visibility: 'authenticated' }),
          [`/notes/${user.uid}/n3`]: helper.data.model.note({ user, visibility: 'public' }),
        });
    });

    describe('user:unauthenticated', () => {
      user = { uid: null };

      before(async () => {
        await helper.logout();
        user = { uid: null };
      });


      test.fail.read(() => '/notes');
      test.fail.delete(() => '/notes');


      test.fail.read(() => `/notes/${u1}/n1`);
      test.fail.read(() => `/notes/${u1}/n2`);
      test.pass.read(() => `/notes/${u1}/n3`);
    });

    describe('user:anonymous', () => {
      user = { uid: 'u0' };

      before(async () => {
        user = await helper.login(null, null);
      });

      after(() =>
        user.delete(),
      );


      test.fail.read(() => '/notes');
      test.fail.delete(() => '/notes');

      test.fail.read(() => `/notes/${user.uid}`);
      test.fail.delete(() => `/notes/${user.uid}`);

      test.fail.read(() => `/notes/${user.uid}/n1`);
      test.fail.create(() => `/notes/${user.uid}/n1`, () => helper.data.model.note({ user }));
      test.fail.delete(() => `/notes/${user.uid}/n1`);


      test.fail.read(() => `/notes/${u1}/n1`);
      test.fail.read(() => `/notes/${u1}/n2`);
      test.pass.read(() => `/notes/${u1}/n3`);
    });

    describe('user:authenticated:0', () => {
      user = { uid: 'u0' };

      before(async () => {
        user = await helper.login('u0@test.user.com', '123456789');
      });

      after(() =>
        user.delete(),
      );


      test.fail.read(() => '/notes');
      test.fail.delete(() => '/notes');

      test.pass.read(() => `/notes/${user.uid}`);
      test.fail.delete(() => `/notes/${user.uid}`);

      test.pass.read(() => `/notes/${user.uid}/n1`);
      test.pass.create(() => `/notes/${user.uid}/n1`, () => helper.data.model.note({ user }));
      test.pass.delete(() => `/notes/${user.uid}/n1`);


      test.fail.read(() => `/notes/${u1}/n1`);
      test.pass.read(() => `/notes/${u1}/n2`);
      test.pass.read(() => `/notes/${u1}/n3`);
    });

    describe('user:authenticated:1', () => {
      user = { uid: 'u1' };

      before(async () => {
        user = await helper.login('u1@test.user.com', '123456789');
      });

      after(() =>
        user.delete(),
      );


      test.pass.read(() => `/notes/${user.uid}/n1`);
      test.fail.create(() => `/notes/${user.uid}/n1`, () => helper.data.model.note({ user }));
      test.fail.update(() => `/notes/${user.uid}/n1`, () => ({ created: helper.data.timestamp }));
      test.pass.update(() => `/notes/${user.uid}/n1`, () => ({ modified: helper.data.timestamp }));
      test.fail.update(() => `/notes/${user.uid}/n1`, () => ({ creator: 'u0' }));
      test.pass.update(() => `/notes/${user.uid}/n1`, () => ({ creator: user.uid }));
      test.pass.update(() => `/notes/${user.uid}/n1`, () => ({ text: 'Title' }));
      test.fail.update(() => `/notes/${user.uid}/n1`, () => ({ visibility: 'private' }));
      test.pass.update(() => `/notes/${user.uid}/n1`, () => ({ visibility: 'authenticated' }));
      test.pass.update(() => `/notes/${user.uid}/n1`, () => ({ visibility: 'public' }));
      test.pass.delete(() => `/notes/${user.uid}/n1`);


      test.pass.read(() => `/notes/${u1}/n1`);
      test.pass.read(() => `/notes/${u1}/n2`);
      test.pass.read(() => `/notes/${u1}/n3`);

      test.pass.delete(() => `/notes/${u1}/n1`);
      test.pass.delete(() => `/notes/${u1}/n2`);
      test.pass.delete(() => `/notes/${u1}/n3`);
    });
  });

  describe('/notes-direct', () => {
    let user = { uid: 'u1' };


    before(async () => {
      user = await helper.login('u1@test.user.com', '123456789');

      await database
        .ref()
        .update({
          '/notes-direct/n1': helper.data.model.note({ user }),
          '/notes-direct/n2': helper.data.model.note({ user, visibility: 'authenticated' }),
          '/notes-direct/n3': helper.data.model.note({ user, visibility: 'public' }),
        });
    });

    describe('user:unauthenticated', () => {
      user = { uid: null };

      before(async () => {
        await helper.logout();
        user = { uid: null };
      });


      test.fail.read(() => '/notes-direct/n1');
      test.fail.read(() => '/notes-direct/n2');
      test.pass.read(() => '/notes-direct/n3');
    });

    describe('user:anonymous', () => {
      user = { uid: 'u0' };

      before(async () => {
        user = await helper.login(null, null);
      });

      after(() =>
        user.delete(),
      );


      test.fail.read(() => '/notes-direct/n1');
      test.fail.read(() => '/notes-direct/n2');
      test.pass.read(() => '/notes-direct/n3');
    });

    describe('user:authenticated:0', () => {
      user = { uid: 'u0' };

      before(async () => {
        user = await helper.login('u0@test.user.com', '123456789');
      });

      after(() =>
        user.delete(),
      );


      test.fail.read(() => '/notes-direct/n1');
      test.pass.read(() => '/notes-direct/n2');
      test.pass.read(() => '/notes-direct/n3');
    });

    describe('user:authenticated:1', () => {
      user = { uid: 'u1' };

      before(async () => {
        user = await helper.login('u1@test.user.com', '123456789');
      });

      after(() =>
        user.delete(),
      );


      test.pass.read(() => '/notes-direct/n1');
      test.pass.read(() => '/notes-direct/n2');
      test.pass.read(() => '/notes-direct/n3');

      test.pass.delete(() => '/notes-direct/n1');
      test.pass.delete(() => '/notes-direct/n2');
      test.pass.delete(() => '/notes-direct/n3');
    });
  });
});
