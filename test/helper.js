/* eslint-disable no-undef, no-unused-vars */


const $ = {
  logout: () =>
    firebase
    .auth()
    .signOut(),
  login: undefined,
  data: {
    timestamp: { '.sv': 'timestamp' },
  },
};


$.login = (email, password) =>
  $.logout()
  .then(() => {
    if (email && password) {
      return firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    }

    return firebase
    .auth()
    .signInAnonymously();
  })
  .catch(err => {
    if (email && password) {
      return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    }

    throw err;
  });


/* ************************************************************ */


$.data.model = {
  note: data =>
    ({
      creator: data.user.uid,
      created: $.data.timestamp,
      modified: $.data.timestamp,
      text: 'Text',
      visibility: data.visibility || null,
    }),
};


$.data.initial = {
  notes: {
    u1: {
      n1: $.data.model.note({ user: { uid: 'u1' } }),
    },
  },

  'notes-direct': {
    n1: $.data.model.note({ user: { uid: 'u1' } }),
    n2: $.data.model.note({ user: { uid: 'u1' }, visibility: 'authenticated' }),
    n3: $.data.model.note({ user: { uid: 'u1' }, visibility: 'public' }),
  },
};


/* ************************************************************ */


if (typeof module === 'object' && module.exports) {
  module.exports = $;
} else {
  const helper = $;
}
