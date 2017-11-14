'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* eslint-disable global-require, no-undef */

if (typeof require === 'function') {
  firebase = require('firebase');
}

/* ************************************************************ */

var helper = {
  logout: function logout() {
    return firebase.auth().signOut();
  },
  login: undefined,
  data: {
    timestamp: { '.sv': 'timestamp' }
  }
};

helper.login = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(email, password) {
    var user;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user = void 0;
            _context.next = 3;
            return helper.logout();

          case 3:
            if (!(email && password)) {
              _context.next = 17;
              break;
            }

            _context.prev = 4;
            _context.next = 7;
            return firebase.auth().signInWithEmailAndPassword(email, password);

          case 7:
            user = _context.sent;
            _context.next = 15;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context['catch'](4);
            _context.next = 14;
            return firebase.auth().createUserWithEmailAndPassword(email, password);

          case 14:
            user = _context.sent;

          case 15:
            _context.next = 18;
            break;

          case 17:
            user = firebase.auth().signInAnonymously();

          case 18:
            return _context.abrupt('return', user);

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[4, 10]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/* ************************************************************ */

helper.data.model = {
  note: function note(data) {
    return {
      creator: data.user.uid,
      created: helper.data.timestamp,
      modified: helper.data.timestamp,
      text: 'Text',
      visibility: data.visibility || null
    };
  }
};

/* ************************************************************ */

if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
  module.exports = helper;
}
'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* eslint-disable no-undef */

var _chai = chai,
    expect = _chai.expect;


mocha.ui('bdd');
mocha.slow(1000);
mocha.timeout(10000);

var $config = mocha.env && /test/.test(mocha.env.NODE_ENV) ? config.test : config.dev;

var storage = firebase.storage(firebase.initializeApp($config));

/* ************************************************************ */

var test = {
  fail: {
    read: function read(path) {
      return it('- READ   ' + path(), _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return storage.ref(path()).getDownloadURL();

              case 3:
                expect().fail();
                _context.next = 9;
                break;

              case 6:
                _context.prev = 6;
                _context.t0 = _context['catch'](0);

                expect(_context.t0.code).to.equal('storage/unauthorized');

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined, [[0, 6]]);
      })));
    },
    write: function write(path, type) {
      var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
        return {};
      };
      return it('- WRITE  ' + path() + ' ' + type, function (done) {
        storage.ref(path()).put(new Blob([Date.now()], { type: type }), meta()).on(firebase.storage.TaskEvent.STATE_CHANGED, null, function (err) {
          expect(err.code).to.equal('storage/unauthorized');
          done();
        }, null);
      });
    },
    delete: function _delete(path) {
      return it('- DELETE ' + path(), _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return storage.ref(path()).delete();

              case 3:
                expect().fail();
                _context2.next = 9;
                break;

              case 6:
                _context2.prev = 6;
                _context2.t0 = _context2['catch'](0);

                expect(_context2.t0.code).to.equal('storage/unauthorized');

              case 9:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined, [[0, 6]]);
      })));
    },
    meta: function meta(path, _meta) {
      return it('- META   ' + path(), _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return storage.ref(path()).updateMetadata(_meta());

              case 3:
                expect().fail();
                _context3.next = 9;
                break;

              case 6:
                _context3.prev = 6;
                _context3.t0 = _context3['catch'](0);

                expect(_context3.t0.code).to.equal('storage/unauthorized');

              case 9:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined, [[0, 6]]);
      })));
    }
  },
  pass: {
    read: function read(path) {
      return it('+ READ   ' + path(), _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var url;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return storage.ref(path()).getDownloadURL();

              case 3:
                url = _context4.sent;

                expect(url).to.be.a('string');
                _context4.next = 10;
                break;

              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4['catch'](0);

                expect(_context4.t0.code).to.equal('storage/object-not-found');

              case 10:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, undefined, [[0, 7]]);
      })));
    },
    write: function write(path, type) {
      var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
        return {};
      };
      return it('+ WRITE  ' + path() + ' ' + type, function (done) {
        storage.ref(path()).put(new Blob([Date.now()], { type: type }), meta()).on(firebase.storage.TaskEvent.STATE_CHANGED, null, done, done);
      });
    },
    delete: function _delete(path) {
      return it('+ DELETE ' + path(), _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return storage.ref(path()).delete();

              case 3:
                _context5.next = 8;
                break;

              case 5:
                _context5.prev = 5;
                _context5.t0 = _context5['catch'](0);

                expect(_context5.t0.code).to.equal('storage/object-not-found');

              case 8:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, undefined, [[0, 5]]);
      })));
    },
    meta: function meta(path, _meta2) {
      return it('+ META   ' + path(), _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return storage.ref(path()).updateMetadata(_meta2());

              case 2:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, undefined);
      })));
    }
  }
};

/* ************************************************************ */

describe('test:storage \u2192 ' + $config.storageBucket, function () {
  describe('/notes', function () {
    var user = { uid: 'u1' };
    var u1 = 'u1';

    before(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return helper.login('u1@test.user.com', '123456789');

            case 2:
              user = _context7.sent;

              u1 = user.uid;

              _context7.next = 6;
              return Promise.all([storage.ref('/notes/' + user.uid + '/n1/123456789.png').put(new Blob([Date.now()], { type: 'image/png' }), { customMetadata: { creator: user.uid } }), storage.ref('/notes/' + user.uid + '/n2/123456789.png').put(new Blob([Date.now()], { type: 'image/png' }), { customMetadata: { creator: user.uid, visibility: 'authenticated' } }), storage.ref('/notes/' + user.uid + '/n3/123456789.png').put(new Blob([Date.now()], { type: 'image/png' }), { customMetadata: { creator: user.uid, visibility: 'public' } })]);

            case 6:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, undefined);
    })));

    describe('user:unauthenticated', function () {
      before(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return helper.logout();

              case 2:
                user = { uid: null };

              case 3:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, undefined);
      })));

      test.fail.read(function () {
        return '/notes';
      });
      test.fail.delete(function () {
        return '/notes';
      });

      test.fail.read(function () {
        return '/notes/' + u1 + '/n1/123456789.png';
      });
      test.fail.read(function () {
        return '/notes/' + u1 + '/n2/123456789.png';
      });
      test.pass.read(function () {
        return '/notes/' + u1 + '/n3/123456789.png';
      });
    });

    describe('user:anonymous', function () {
      before(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return helper.login(null, null);

              case 2:
                user = _context9.sent;

              case 3:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, undefined);
      })));

      after(function () {
        return user.delete();
      });

      test.fail.read(function () {
        return '/notes';
      });
      test.fail.delete(function () {
        return '/notes';
      });

      test.fail.read(function () {
        return '/notes/' + user.uid;
      });
      test.fail.delete(function () {
        return '/notes/' + user.uid;
      });

      test.fail.read(function () {
        return '/notes/' + user.uid + '/n1/123456789.png';
      });
      test.fail.write(function () {
        return '/notes/' + user.uid + '/n1/123456789.png';
      }, 'image/png');
      test.fail.delete(function () {
        return '/notes/' + user.uid + '/n1/123456789.png';
      });

      test.fail.read(function () {
        return '/notes/' + u1 + '/n1/123456789.png';
      });
      test.fail.read(function () {
        return '/notes/' + u1 + '/n2/123456789.png';
      });
      test.pass.read(function () {
        return '/notes/' + u1 + '/n3/123456789.png';
      });
    });

    describe('user:authenticated:0', function () {
      before(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return helper.login('u0@test.user.com', '123456789');

              case 2:
                user = _context10.sent;

              case 3:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, undefined);
      })));

      after(function () {
        return user.delete();
      });

      test.fail.read(function () {
        return '/notes';
      });
      test.fail.delete(function () {
        return '/notes';
      });

      test.fail.read(function () {
        return '/notes/' + user.uid;
      });
      test.fail.delete(function () {
        return '/notes/' + user.uid;
      });

      test.pass.read(function () {
        return '/notes/' + user.uid + '/n1/123456789.png';
      });
      test.pass.write(function () {
        return '/notes/' + user.uid + '/n1/123456789.png';
      }, 'image/png');
      test.pass.delete(function () {
        return '/notes/' + user.uid + '/n1/123456789.png';
      });

      test.fail.read(function () {
        return '/notes/' + u1 + '/n1/123456789.png';
      });
      test.pass.read(function () {
        return '/notes/' + u1 + '/n2/123456789.png';
      });
      test.pass.read(function () {
        return '/notes/' + u1 + '/n3/123456789.png';
      });
    });

    describe('user:authenticated:1', function () {
      before(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return helper.login('u1@test.user.com', '123456789');

              case 2:
                user = _context11.sent;

              case 3:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, undefined);
      })));

      after(function () {
        return user.delete();
      });

      test.pass.read(function () {
        return '/notes/' + user.uid + '/n1/123456789.png';
      });
      test.fail.write(function () {
        return '/notes/' + user.uid + '/n1/123456789.png';
      }, 'text/plain');
      test.fail.write(function () {
        return '/notes/' + user.uid + '/n1/123456789.png';
      }, 'image/png');
      test.pass.meta(function () {
        return '/notes/' + user.uid + '/n1/123456789.png';
      }, function () {
        return { contentType: 'image/png' };
      });
      test.pass.meta(function () {
        return '/notes/' + user.uid + '/n1/123456789.png';
      }, function () {
        return { private: true };
      });
      test.pass.meta(function () {
        return '/notes/' + user.uid + '/n1/123456789.png';
      }, function () {
        return { private: null };
      });
      test.pass.meta(function () {
        return '/notes/' + user.uid + '/n1/123456789.png';
      }, function () {
        return { customMetadata: { private: 'true' } };
      });
      test.fail.meta(function () {
        return '/notes/' + user.uid + '/n1/123456789.png';
      }, function () {
        return { customMetadata: { visibility: 'private' } };
      });
      test.pass.meta(function () {
        return '/notes/' + user.uid + '/n1/123456789.png';
      }, function () {
        return { customMetadata: { visibility: 'authenticated' } };
      });
      test.pass.meta(function () {
        return '/notes/' + user.uid + '/n1/123456789.png';
      }, function () {
        return { customMetadata: { visibility: 'public' } };
      });
      test.pass.meta(function () {
        return '/notes/' + user.uid + '/n1/123456789.png';
      }, function () {
        return { customMetadata: { visibility: null } };
      });

      test.pass.read(function () {
        return '/notes/' + u1 + '/n1/123456789.png';
      });
      test.pass.read(function () {
        return '/notes/' + u1 + '/n2/123456789.png';
      });
      test.pass.read(function () {
        return '/notes/' + u1 + '/n3/123456789.png';
      });

      test.pass.delete(function () {
        return '/notes/' + u1 + '/n1/123456789.png';
      });
      test.pass.delete(function () {
        return '/notes/' + u1 + '/n2/123456789.png';
      });
      test.pass.delete(function () {
        return '/notes/' + u1 + '/n3/123456789.png';
      });
    });
  });

  describe('/notes-direct', function () {
    var user = { uid: 'u1' };

    before(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return helper.login('u1@test.user.com', '123456789');

            case 2:
              user = _context12.sent;
              _context12.next = 5;
              return Promise.all([storage.ref('/notes-direct/n1/123456789.png').put(new Blob([Date.now()], { type: 'image/png' }), { customMetadata: { creator: user.uid } }), storage.ref('/notes-direct/n2/123456789.png').put(new Blob([Date.now()], { type: 'image/png' }), { customMetadata: { creator: user.uid, visibility: 'authenticated' } }), storage.ref('/notes-direct/n3/123456789.png').put(new Blob([Date.now()], { type: 'image/png' }), { customMetadata: { creator: user.uid, visibility: 'public' } })]);

            case 5:
            case 'end':
              return _context12.stop();
          }
        }
      }, _callee12, undefined);
    })));

    describe('user:unauthenticated', function () {
      before(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return helper.logout();

              case 2:
                user = { uid: null };

              case 3:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, undefined);
      })));

      test.fail.read(function () {
        return '/notes-direct/n1/123456789.png';
      });
      test.fail.read(function () {
        return '/notes-direct/n2/123456789.png';
      });
      test.pass.read(function () {
        return '/notes-direct/n3/123456789.png';
      });
    });

    describe('user:anonymous', function () {
      before(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.next = 2;
                return helper.login(null, null);

              case 2:
                user = _context14.sent;

              case 3:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, undefined);
      })));

      after(function () {
        return user.delete();
      });

      test.fail.read(function () {
        return '/notes-direct/n1/123456789.png';
      });
      test.fail.read(function () {
        return '/notes-direct/n2/123456789.png';
      });
      test.pass.read(function () {
        return '/notes-direct/n3/123456789.png';
      });
    });

    describe('user:authenticated:0', function () {
      before(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return helper.login('u0@test.user.com', '123456789');

              case 2:
                user = _context15.sent;

              case 3:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, undefined);
      })));

      after(function () {
        return user.delete();
      });

      test.fail.read(function () {
        return '/notes-direct/n1/123456789.png';
      });
      test.pass.read(function () {
        return '/notes-direct/n2/123456789.png';
      });
      test.pass.read(function () {
        return '/notes-direct/n3/123456789.png';
      });
    });

    describe('user:authenticated:1', function () {
      before(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.next = 2;
                return helper.login('u1@test.user.com', '123456789');

              case 2:
                user = _context16.sent;

              case 3:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, undefined);
      })));

      after(function () {
        return user.delete();
      });

      test.pass.read(function () {
        return '/notes-direct/n1/123456789.png';
      });
      test.pass.read(function () {
        return '/notes-direct/n2/123456789.png';
      });
      test.pass.read(function () {
        return '/notes-direct/n3/123456789.png';
      });

      test.pass.delete(function () {
        return '/notes-direct/n1/123456789.png';
      });
      test.pass.delete(function () {
        return '/notes-direct/n2/123456789.png';
      });
      test.pass.delete(function () {
        return '/notes-direct/n3/123456789.png';
      });
    });
  });
});
