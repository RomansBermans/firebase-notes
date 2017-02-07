/* */


const helper = require('../helper');

const bolt = require('firebase-bolt');
const fs = require('fs');

const chai = require('chai');
const targaryen = require('targaryen/plugins/chai');


/* ************************************************************ */


const expect = chai.expect;
chai.use(targaryen);


/* ************************************************************ */


const test = user => ({
  fail: {
    read: path =>
      it(`- READ   ${path}`, () =>
        expect(user).cannot.read.path(path)
      ),
    create: (path, data) =>
      it(`- CREATE ${path}`, () =>
        expect(user).cannot.write(data).to.path(path)
      ),
    update: (path, data) =>
      it(`- UPDATE ${path} \u2192 ${Object.keys(data).join(', ')}`, () =>
        expect(user).cannot.patch(data).to.path(path)
      ),
    delete: path =>
      it(`- DELETE ${path}`, () =>
        expect(user).cannot.write(null).to.path(path)
      ),
  },
  pass: {
    read: path =>
      it(`+ READ   ${path}`, () =>
        expect(user).can.read.path(path)
      ),
    create: (path, data) =>
      it(`+ CREATE ${path}`, () =>
        expect(user).can.write(data).to.path(path)
      ),
    update: (path, data) =>
      it(`+ UPDATE ${path} \u2192 ${Object.keys(data).join(', ')}`, () =>
        expect(user).can.patch(data).to.path(path)
      ),
    delete: path =>
      it(`+ DELETE ${path}`, () =>
        expect(user).can.write(null).to.path(path)
      ),
  },
});


/* ************************************************************ */


describe('test:database', () => {
  before(done => {
    fs.readFile('./database/rules.bolt', 'utf8', (err, rules) => {
      if (err) { throw err; }
      targaryen.setFirebaseRules(bolt.generate(rules));
      targaryen.setFirebaseData({
        notes: {
          u1: {
            n1: helper.data.model.note({ user: { uid: 'u1' } }),
            n2: helper.data.model.note({ user: { uid: 'u1' }, visibility: 'authenticated' }),
            n3: helper.data.model.note({ user: { uid: 'u1' }, visibility: 'public' }),
          },
        },
        'notes-direct': {
          n1: helper.data.model.note({ user: { uid: 'u1' } }),
          n2: helper.data.model.note({ user: { uid: 'u1' }, visibility: 'authenticated' }),
          n3: helper.data.model.note({ user: { uid: 'u1' }, visibility: 'public' }),
        },
      });
      targaryen.setDebug(true);
      done();
    });
  });

  describe('/notes', () => {
    describe('user:unauthenticated', () => {
      const user = { uid: null };


      test(user).fail.read('/notes');
      test(user).fail.delete('/notes');


      test(user).fail.read('/notes/u1/n1');
      test(user).fail.read('/notes/u1/n2');
      test(user).pass.read('/notes/u1/n3');
    });

    describe('user:anonymous', () => {
      const user = { uid: 'u0', email: null };


      test(user).fail.read('/notes');
      test(user).fail.delete('/notes');

      test(user).fail.read(`/notes/${user.uid}`);
      test(user).fail.delete(`/notes/${user.uid}`);

      test(user).fail.read(`/notes/${user.uid}/n1`);
      test(user).fail.create(`/notes/${user.uid}/n1`, helper.data.model.note({ user }));
      test(user).fail.delete(`/notes/${user.uid}/n1`);


      test(user).fail.read('/notes/u1/n1');
      test(user).fail.read('/notes/u1/n2');
      test(user).pass.read('/notes/u1/n3');
    });

    describe('user:authenticated:0', () => {
      const user = { uid: 'u0', email: 'u0@test.user.com' };


      test(user).fail.read('/notes');
      test(user).fail.delete('/notes');

      test(user).pass.read(`/notes/${user.uid}`);
      test(user).fail.delete(`/notes/${user.uid}`);

      test(user).pass.read(`/notes/${user.uid}/n1`);
      test(user).pass.create(`/notes/${user.uid}/n1`, helper.data.model.note({ user }));
      test(user).pass.delete(`/notes/${user.uid}/n1`);


      test(user).fail.read('/notes/u1/n1');
      test(user).pass.read('/notes/u1/n2');
      test(user).pass.read('/notes/u1/n3');
    });

    describe('user:authenticated:1', () => {
      const user = { uid: 'u1', email: 'u1@test.user.com' };


      test(user).pass.read(`/notes/${user.uid}/n1`);
      test(user).fail.create(`/notes/${user.uid}/n1`, helper.data.model.note({ user }));
      test(user).fail.update(`/notes/${user.uid}/n1`, { created: helper.data.timestamp });
      test(user).pass.update(`/notes/${user.uid}/n1`, { modified: helper.data.timestamp });
      test(user).fail.update(`/notes/${user.uid}/n1`, { creator: 'u0' });
      test(user).pass.update(`/notes/${user.uid}/n1`, { creator: user.uid });
      test(user).pass.update(`/notes/${user.uid}/n1`, { text: 'Title' });
      test(user).fail.update(`/notes/${user.uid}/n1`, { visibility: 'private' });
      test(user).pass.update(`/notes/${user.uid}/n1`, { visibility: 'authenticated' });
      test(user).pass.update(`/notes/${user.uid}/n1`, { visibility: 'public' });
      test(user).pass.delete(`/notes/${user.uid}/n1`);


      test(user).pass.read('/notes/u1/n1');
      test(user).pass.read('/notes/u1/n2');
      test(user).pass.read('/notes/u1/n3');

      test(user).pass.delete('/notes/u1/n1');
      test(user).pass.delete('/notes/u1/n2');
      test(user).pass.delete('/notes/u1/n3');
    });
  });

  describe('/notes-direct', () => {
    describe('user:unauthenticated', () => {
      const user = { uid: null };


      test(user).fail.read('/notes-direct/n1');
      test(user).fail.read('/notes-direct/n2');
      test(user).pass.read('/notes-direct/n3');
    });

    describe('user:anonymous', () => {
      const user = { uid: 'u0', email: null };


      test(user).fail.read('/notes-direct/n1');
      test(user).fail.read('/notes-direct/n2');
      test(user).pass.read('/notes-direct/n3');
    });

    describe('user:authenticated:0', () => {
      const user = { uid: 'u0', email: 'u0@test.user.com' };


      test(user).fail.read('/notes-direct/n1');
      test(user).pass.read('/notes-direct/n2');
      test(user).pass.read('/notes-direct/n3');
    });

    describe('user:authenticated:1', () => {
      const user = { uid: 'u1', email: 'u1@test.user.com' };


      test(user).pass.read('/notes-direct/n1');
      test(user).pass.read('/notes-direct/n2');
      test(user).pass.read('/notes-direct/n3');

      test(user).pass.delete('/notes-direct/n1');
      test(user).pass.delete('/notes-direct/n2');
      test(user).pass.delete('/notes-direct/n3');
    });
  });
});
