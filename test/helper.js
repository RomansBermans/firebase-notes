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


$.data.model = {
  public: data =>
    ({
      creator: data.user.uid,
      title: 'Title',
      visibility: data.visibility || null,
    }),
  note: data =>
    ({
      creator: data.user.uid,
      created: $.data.timestamp,
      modified: $.data.timestamp,
      title: 'Title',
      text: 'Text',
      visibility: data.visibility || null,
    }),
};


$.data.initial = {
  public: {
    p1: $.data.model.public({ user: { uid: 'u1' } }),
    p2: $.data.model.public({ user: { uid: 'u1' }, visibility: 'authenticated' }),
    p3: $.data.model.public({ user: { uid: 'u1' }, visibility: 'public' }),
  },
  notes: {
    u1: {
      n1: $.data.model.note({ user: { uid: 'u1' } }),
    },
  },
};


if (typeof module === 'object' && module.exports) {
  module.exports = $;
} else {
  const helper = $;
}
