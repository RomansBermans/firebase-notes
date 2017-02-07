# firebase-notes [![Build Status](https://travis-ci.org/RomansBermans/firebase-notes.svg?branch=master)](https://travis-ci.org/RomansBermans/firebase-notes)

Test a Firebase application with [Mocha](https://mochajs.org/), [Chai](http://chaijs.com/) and [Targaryen](https://github.com/goldibex/targaryen).

## Setup

### Firebase
1. Create a project on [Firebase](https://console.firebase.google.com/)
<br/><img width="448" alt="776c76ec-c777-11e6-975c-6974e3bb9f42" src="https://cloud.githubusercontent.com/assets/358467/22717020/95c70f28-ed90-11e6-9abe-dbc56be509a6.png" />
2. Note down the Project ID
<br/><img width="526" alt="5a17e886-c779-11e6-9608-3a128400dca9" src="https://cloud.githubusercontent.com/assets/358467/22717019/95bab642-ed90-11e6-80a8-96fc373ac1bd.png" />
3. Enable [Authentication > SIGN-IN METHOD > Sign-in provides > Email / Password &amp; Anonymous](https://console.firebase.google.com/project/prototype-9c221/authentication/providers)
<br/><img width="703" alt="2b149dda-c77a-11e6-8ccf-d5e9401d8e06" src="https://cloud.githubusercontent.com/assets/358467/22717018/95a1e5f4-ed90-11e6-81aa-d2d0a4fcb1da.png" />
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
<img width="1200" alt="firebase-notes-tests" src="https://cloud.githubusercontent.com/assets/358467/22717022/992c39ea-ed90-11e6-86bc-fe4d3526f90f.png">

## Deploy

### Command Line
```
npm run deploy
```

### Travis CI
Add `[deploy]` to you git commit message.
