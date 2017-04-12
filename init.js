/* eslint-disable global-require, no-console */

const fs = require('fs');
const shell = require('shelljs');


/* ************************************************************ */


module.exports = {
  prepare: {
    app: (project, environment = 'dev') => {
      let config;
      if (project) {
        const $config = require('./environment/config');
        config = $config[Object.keys($config).find(k => $config[k].projectId === project)];
      } else {
        config = require('./environment/config')[environment];
      }

      const source1 = './app/app.js';
      fs.readFile(source1, 'utf8', (err1, data) => {
        if (err1) { throw err1; }

        const $data = data.replace(/(const config = )[^;]+(;)/g, `$1${JSON.stringify(config)}$2`);

        fs.writeFile(source1, $data, err2 => {
          if (err2) { throw err2; }

          console.log('\n\u001B[1m\x1b[32m\u2713  \u001B[1m%s\x1b[0m', `utils.prepare.app \u2192 ${project || environment} \u2192 ${source1}`);
        });
      });

      const source2 = './.firebaserc';
      fs.readFile(source2, 'utf8', (err1, data) => {
        if (err1) { throw err1; }

        const $data = data.replace(/("default": ")[^"]?(")/g, `$1${config.projectId}$2`);

        fs.writeFile(source2, $data, err2 => {
          if (err2) { throw err2; }

          console.log('\n\u001B[1m\x1b[32m\u2713  \u001B[1m%s\x1b[0m', `utils.prepare.app \u2192 ${project || environment} \u2192 ${source2}`);
        });
      });
    },
    storage: project => {
      const source = './storage/rules.fire';

      fs.readFile(source, 'utf8', (err1, data) => {
        if (err1) { throw err1; }

        const $data = data.replace(/(\/b\/)[a-z0-9-]{0,30}(.appspot.com\/o)/g, `$1${project}$2`);

        fs.writeFile(source, $data, err2 => {
          if (err2) { throw err2; }

          console.log('\n\u001B[1m\x1b[32m\u2713  \u001B[1m%s\x1b[0m', `utils.prepare.storage \u2192 ${project} \u2192 ${source}`);
        });
      });
    },
  },

  deploy: target => {
    const environment = /test/.test(process.env.NODE_ENV) ? 'test' : 'dev';
    const project = require('./environment/config')[environment].projectId;

    return shell.exec(`PROJECT=${project} npm run deploy:${target}`, () =>
      console.log('\n\u001B[1m\x1b[32m\u2713  \u001B[1m%s\x1b[0m', `utils.deploy.${target} \u2192 ${project}`)
    );
  },

  patch: {
    firebase: () => {
      const source = './node_modules/firebase/database-node.js';
      fs.readFile(source, 'utf8', (err1, data) => {
        if (err1) { throw err1; }

        // FIXME: temporary workaround for disabling logging in Firebase
        const $data = data.replace(';"undefined"!==typeof console.warn?console.warn(b):console.log(b)', ';/*"undefined"!==typeof console.warn?console.warn(b):console.log(b)*/');
        //

        fs.writeFile(source, $data, err2 => {
          if (err2) { throw err2; }

          console.log('\n\u001B[1m\x1b[32m\u2713  \u001B[1m%s\x1b[0m', `utils.patch.firebase \u2192 ${source}`);
        });
      });
    },
  },
};
