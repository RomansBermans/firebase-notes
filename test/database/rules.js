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
      targaryen.setFirebaseData(helper.data.initial);
      targaryen.setDebug(true);
      done();
    });
  });


  describe('user:unauthenticated', () => {
    const user = { uid: null };


    test(user).fail.read('/public/p1');
    test(user).fail.read('/public/p2');
    test(user).pass.read('/public/p3');


    test(user).fail.read('/notes');
    test(user).fail.delete('/notes');
  });


  describe('user:anonymous', () => {
    const user = { uid: 'u0', email: null };


    test(user).fail.read('/public/p1');
    test(user).fail.read('/public/p2');
    test(user).pass.read('/public/p3');


    test(user).fail.read('/notes');
    test(user).fail.delete('/notes');

    test(user).fail.read(`/notes/${user.uid}`);
    test(user).fail.delete(`/notes/${user.uid}`);

    test(user).fail.read(`/notes/${user.uid}/n1`);
    test(user).fail.create(`/notes/${user.uid}/n1`, helper.data.model.note({ user }));
    test(user).fail.delete(`/notes/${user.uid}/n1`);
  });


  describe('user:authenticated:0', () => {
    const user = { uid: 'u0', email: 'u0@test.user.com' };


    test(user).fail.read('/public/p1');
    test(user).pass.read('/public/p2');
    test(user).pass.read('/public/p3');


    test(user).fail.read('/notes');
    test(user).fail.delete('/notes');

    test(user).pass.read(`/notes/${user.uid}`);
    test(user).fail.delete(`/notes/${user.uid}`);

    test(user).pass.read(`/notes/${user.uid}/n1`);
    test(user).pass.create(`/notes/${user.uid}/n1`, helper.data.model.note({ user }));
    test(user).pass.delete(`/notes/${user.uid}/n1`);
  });


  describe('user:authenticated:1', () => {
    const user = { uid: 'u1', email: 'u1@test.user.com' };


    test(user).pass.read('/public/p1');
    test(user).pass.read('/public/p2');
    test(user).pass.read('/public/p3');

    test(user).pass.delete('/public/p1');
    test(user).pass.delete('/public/p2');
    test(user).pass.delete('/public/p3');


    test(user).pass.read(`/notes/${user.uid}/n1`);
    test(user).fail.create(`/notes/${user.uid}/n1`, helper.data.model.note({ user }));
    test(user).fail.update(`/notes/${user.uid}/n1`, { created: helper.data.timestamp });
    test(user).pass.update(`/notes/${user.uid}/n1`, { modified: helper.data.timestamp });
    test(user).fail.update(`/notes/${user.uid}/n1`, { creator: 'u0' });
    test(user).pass.update(`/notes/${user.uid}/n1`, { creator: user.uid });
    test(user).fail.update(`/notes/${user.uid}/n1`, { title: '' });
    test(user).pass.update(`/notes/${user.uid}/n1`, { title: 'Title' });
    test(user).fail.update(`/notes/${user.uid}/n1`, { visibility: 'private' });
    test(user).pass.update(`/notes/${user.uid}/n1`, { visibility: 'authenticated' });
    test(user).pass.update(`/notes/${user.uid}/n1`, { visibility: 'public' });
    test(user).pass.delete(`/notes/${user.uid}/n1`);
  });
});
