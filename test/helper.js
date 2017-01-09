/* eslint-disable no-undef, no-unused-vars, func-names, prefer-arrow-callback, object-shorthand */

const $ = {
  logout: undefined,
  login: undefined,
  data: {
    timestamp: { '.sv': 'timestamp' },
  },
};


$.logout = function () {
  return firebase.auth()
  .signOut();
};

$.login = function (email, password) {
  return $.logout()
  .then(function () {
    if (email && password) {
      return firebase.auth()
      .signInWithEmailAndPassword(email, password);
    }

    return firebase.auth().signInAnonymously();
  })
  .catch(function (err) {
    if (email && password) {
      return firebase.auth()
      .createUserWithEmailAndPassword(email, password);
    }

    throw err;
  });
};


$.data.model = {
  note: function (data) {
    return {
      creator: data.user.uid,
      created: $.data.timestamp,
      modified: $.data.timestamp,
      title: 'Title',
      text: 'Text',
      visibilty: data.visibilty || null,
    };
  },
};


$.data.initial = {
  notes: {
    1: {
      1: $.data.model.note({ user: { uid: '1' } }),
    },
    2: {
      2: $.data.model.note({ user: { uid: '2' } }),
    },
  },
};


if (typeof module === 'object' && module.exports) {
  module.exports = $;
} else {
  const helper = $;
}
