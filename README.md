# firebase-notes [![Build Status](https://travis-ci.org/RomansBermans/firebase-notes.svg?branch=master)](https://travis-ci.org/RomansBermans/firebase-notes)

Test a Firebase application with [Mocha](https://mochajs.org/), [Chai](http://chaijs.com/) and [Targaryen](https://github.com/goldibex/targaryen).

## Setup

### Firebase
1. Create a project on [Firebase](https://console.firebase.google.com/)
<br/><img src="https://cloud.githubusercontent.com/assets/358467/21387339/776c76ec-c777-11e6-975c-6974e3bb9f42.png" width="448" />
2. Note down the Project ID
<br/><img src="https://cloud.githubusercontent.com/assets/358467/21387738/5a17e886-c779-11e6-9608-3a128400dca9.png" width="526" />
3. Enable [Authentication > SIGN-IN METHOD > Sign-in provides > Email / Password &amp; Anonymous](https://console.firebase.google.com/project/prototype-9c221/authentication/providers)
<br/><img src="https://cloud.githubusercontent.com/assets/358467/21387907/2b149dda-c77a-11e6-8ccf-d5e9401d8e06.png" width="703" />
4. If using Travis CI:
    1. Create an account on [Travis CI](https://travis-ci.org/) and activate your repository
    2. Execute `firebase login:ci`
    3. Add FIREBASE_TOKEN to Settings > Environment Variables

## Install
```
npm install
```

## Test
```
npm test
```

## Deploy

### Command Line
```
npm run deploy
```

### Travis CI
Add `[deploy]` to you git commit message.
