# firebase-notes [![Build Status](https://travis-ci.org/RomansBermans/firebase-notes.svg?branch=master)](https://travis-ci.org/RomansBermans/firebase-notes)

Test a Firebase application with [Chai](http://chaijs.com/), [Mocha](https://mochajs.org/) and [Targaryen](https://github.com/goldibex/targaryen).

## Setup
1. Install [Node.js](https://nodejs.org/en/download/)
2. Create a project on [Firebase](https://console.firebase.google.com/)
3. Note down the Project ID
4. Enable Authentication > SIGN-IN METHOD > Sign-in providers > Email/Password &amp; Anonymous
<br/><img width="703" alt="2b149dda-c77a-11e6-8ccf-d5e9401d8e06" src="https://cloud.githubusercontent.com/assets/358467/22717018/95a1e5f4-ed90-11e6-81aa-d2d0a4fcb1da.png" />
5. If using Travis CI:
    1. Create an account on [Travis CI](https://travis-ci.org/) and activate your repository
    2. Execute `firebase login:ci`
    3. Add FIREBASE_TOKEN to Settings > Environment Variables

## Install
```
npm install
```
## Start
```
npm start
```
<img width="218" alt="screen shot 2017-02-08 at 00 02 07" src="https://cloud.githubusercontent.com/assets/358467/22717273/028426fe-ed92-11e6-8bf6-e1e3a96a94f7.png" /><img width="218" alt="screen shot 2017-02-08 at 00 05 18" src="https://cloud.githubusercontent.com/assets/358467/22717329/5b67b2ae-ed92-11e6-9f92-dc786467044f.png" /><img width="218" alt="screen shot 2017-02-07 at 23 59 57" src="https://cloud.githubusercontent.com/assets/358467/22717270/027db076-ed92-11e6-8979-87ed46122f2d.png" /><img width="218" alt="screen shot 2017-02-08 at 00 00 26" src="https://cloud.githubusercontent.com/assets/358467/22717271/02815d70-ed92-11e6-9b53-d506354ef66d.png" />

## Test
```
npm test
```
<img width="1200" alt="firebase-notes-tests" src="https://cloud.githubusercontent.com/assets/358467/22717022/992c39ea-ed90-11e6-86bc-fe4d3526f90f.png">

## Deploy

### Command Line
Replace FIREBASE-PROJECT-ID with your Project ID and execute the following command.
```
export PROJECT=FIREBASE-PROJECT-ID && npm run deploy
```

### Travis CI
Add `[deploy]` to you git commit message.

## Demo
https://prototype-9c221.firebaseapp.com/
