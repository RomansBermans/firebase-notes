/* eslint-disable no-undef, no-unused-vars, global-require */


if (typeof require === 'function') {
  firebase = require('firebase');
}


/* ************************************************************ */


const helper = {
  logout: () =>
    firebase
    .auth()
    .signOut(),
  login: undefined,
  data: {
    timestamp: { '.sv': 'timestamp' },
  },
};


helper.login = (email, password) => {
  if (email && password) {
    return helper.logout()
    .then(() =>
      firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
    )
    .catch(() =>
      firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
    );
  }

  return helper.logout()
  .then(() =>
    firebase
    .auth()
    .signInAnonymously()
  );
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
