/* eslint-disable no-unused-vars */


const FIREBASE_CLIENT_CONFIG_DEV = {
  apiKey: 'AIzaSyBXkQvHwMcJIULuK0D0PI9vryAVscrqfFM',
  authDomain: 'prototype-9c221.firebaseapp.com',
  databaseURL: 'https://prototype-9c221.firebaseio.com',
  storageBucket: 'prototype-9c221.appspot.com',
  messagingSenderId: '954671244432',
};

const FIREBASE_CLIENT_CONFIG_TEST = {
  apiKey: 'AIzaSyBXkQvHwMcJIULuK0D0PI9vryAVscrqfFM',
  authDomain: 'prototype-9c221.firebaseapp.com',
  databaseURL: 'https://prototype-9c221.firebaseio.com',
  storageBucket: 'prototype-9c221.appspot.com',
  messagingSenderId: '954671244432',
};

const FIREBASE_CLIENT_CONFIG_STAG = {
  apiKey: 'AIzaSyBXkQvHwMcJIULuK0D0PI9vryAVscrqfFM',
  authDomain: 'prototype-9c221.firebaseapp.com',
  databaseURL: 'https://prototype-9c221.firebaseio.com',
  storageBucket: 'prototype-9c221.appspot.com',
  messagingSenderId: '954671244432',
};

const FIREBASE_CLIENT_CONFIG_PROD = {
  apiKey: 'AIzaSyBXkQvHwMcJIULuK0D0PI9vryAVscrqfFM',
  authDomain: 'prototype-9c221.firebaseapp.com',
  databaseURL: 'https://prototype-9c221.firebaseio.com',
  storageBucket: 'prototype-9c221.appspot.com',
  messagingSenderId: '954671244432',
};


/* ************************************************************ */


if (typeof module === 'object' && module.exports) {
  module.exports = {
    dev: FIREBASE_CLIENT_CONFIG_DEV,
    test: FIREBASE_CLIENT_CONFIG_TEST,
    stag: FIREBASE_CLIENT_CONFIG_STAG,
    prod: FIREBASE_CLIENT_CONFIG_PROD,
  };
}
