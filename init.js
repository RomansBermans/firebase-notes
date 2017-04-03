/* eslint-disable global-require, no-console */

const fs = require('fs');
const shell = require('shelljs');


/* ************************************************************ */


module.exports = {
  prepare: {
    storage: project => {
      const source = './storage/rules.fire';

      fs.readFile(source, 'utf8', (err1, data) => {
        if (err1) { throw err1; }

        const $data = data.replace(/(\/b\/)[a-z0-9-]{0,30}(.appspot.com\/o)/g, `$1${project}$2`);

        fs.writeFile(source, $data, err2 => {
          if (err2) { throw err2; }

          console.log('\n\u001B[1m\x1b[32m\u2713  \u001B[1m%s\x1b[0m', `utils.prepare.storage \u2192 ${project}`);
        });
      });
    },
  },

  deploy: target => {
    const environment = /test/.test(process.env.NODE_ENV) ? 'test' : 'dev';
    const project = require('./environment/settings')[environment];

    return shell.exec(`PROJECT=${project} npm run deploy:${target}`, () =>
      console.log('\n\u001B[1m\x1b[32m\u2713  \u001B[1m%s\x1b[0m', `utils.deploy.${target} \u2192 ${project}`)
    );
  },

  patch: {
    firebase: () => {
      const source = './node_modules/firebase/firebase.js';

      fs.readFile(source, 'utf8', (err1, data) => {
        if (err1) { throw err1; }

        // FIXME: temporary workaround for disabling logging in Firebase
        const $data = data.replace(';"undefined"!==typeof console.warn?console.warn(b):console.log(b)', ';/*"undefined"!==typeof console.warn?console.warn(b):console.log(b)*/');
        //

        fs.writeFile(source, $data, err2 => {
          if (err2) { throw err2; }

          console.log('\n\u001B[1m\x1b[32m\u2713  \u001B[1m%s\x1b[0m', 'utils.patch.firebase');
        });
      });
    },
  },
};
