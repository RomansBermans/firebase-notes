/* eslint-disable no-undef */


if (typeof process !== 'undefined') {
  firebase = require('firebase');
}


/* ************************************************************ */


const helper = {
  logout: () => firebase.auth().signOut(),
  login: undefined,
  data: {
    timestamp: { '.sv': 'timestamp' },
  },
};


helper.login = async (email, password) => {
  let user;

  await helper.logout();

  if (email && password) {
    try {
      user = await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (err) {
      user = await firebase.auth().createUserWithEmailAndPassword(email, password);
    }
  } else {
    user = firebase.auth().signInAnonymously();
  }

  return user;
};


/* ************************************************************ */


helper.data.model = {
  note: data =>
    ({
      creator: data.user.uid,
      created: helper.data.timestamp,
      modified: helper.data.timestamp,
      text: 'Text',
      visibility: data.visibility || null,
    }),
};


/* ************************************************************ */


if (typeof module === 'object' && module.exports) {
  module.exports = helper;
}
