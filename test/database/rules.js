/* */

const { data } = require('../helper');

const bolt = require('firebase-bolt');
const fs = require('fs');

const chai = require('chai');
const targaryen = require('targaryen');


/* ************************************************************ */


const expect = chai.expect;
chai.use(targaryen.chai);


/* ************************************************************ */


const test = (user, name, path, r = false, c = {}, u = {}, d = false) => {
  it(`${name} ${r ? ' ' : '!'}READ`, () =>
    expect(user)[`can${!r ? 'not' : ''}`].read.path(path)
  );

  Object.keys(c).forEach(k => {
    c[k].forEach(ck => {
      it(`${name} ${k === 'true' ? ' ' : '!'}CREATE`, () =>
        expect(user)[`can${k === 'true' ? '' : 'not'}`].write(ck).to.path(path)
      );
    });
  });

  Object.keys(u).forEach(k => {
    u[k].forEach(uk => {
      it(`$name ${k === 'true' ? ' ' : '!'}UPDATE +${Object.keys(uk).length - 1}`, () =>
        expect(user)[`can${k === 'true' ? '' : 'not'}`].patch(uk).to.path('')
      );
    });
  });

  it(`${name} ${d ? ' ' : '!'}DELETE`, () =>
    expect(user)[`can${!d ? 'not' : ''}`].write(null).to.path(path)
  );
};


/* ************************************************************ */


describe('database', () => {
  let user;
  const note = `${Date.now()}`.slice(-9);


  before(done => {
    fs.readFile('./database/rules.bolt', 'utf8', (err, rules) => {
      if (err) { throw err; }
      targaryen.setFirebaseRules(bolt.generate(rules));
      targaryen.setFirebaseData(data.initial);
      done();
    });
  });


  describe('user:unauthenticated', () => {
    user = { uid: null };


    test(user, '/notes', '/notes');

    test(user, '/notes/{user} owner:no ', '/notes/0');

    test(user, '/notes/{user}/{note} owner:no ', '/notes/0/0');
  });


  describe('user:anonymous:0', () => {
    user = { uid: '0', email: null };


    test(user, '/notes', '/notes');

    test(user, '/notes/{user} owner:no ', '/notes/0');
    test(user, '/notes/{user} owner:yes', `/notes/${user.uid}`);

    test(user, '/notes/{user}/{note} owner:no ', '/notes/0/0');
    test(user, '/notes/{user}/{note} owner:yes', `/notes/${user.uid}/${note}`);
  });


  describe('user:authenticated:1', () => {
    user = { uid: '1', email: '1@test.user.com' };


    test(user, '/notes', '/notes');

    test(user, '/notes/{user} owner:no ', '/notes/0');
    test(user, '/notes/{user} owner:yes', `/notes/${user.uid}`, true);

    test(user, '/notes/{user}/{note} owner:no ', '/notes/0/0');
    test(user, '/notes/{user}/{note} owner:yes', `/notes/${user.uid}/1`, true, { false: [data.model.note({ user })] }, {}, true);
    test(user, '/notes/{user}/{note} owner:yes', `/notes/${user.uid}/${note}`, true, { true: [data.model.note({ user })] }, {}, true);
  });
});
