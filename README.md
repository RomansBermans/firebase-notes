# firebase-notes

Test a simple Firebase notes application with [Chai](http://chaijs.com/), [Mocha](https://mochajs.org/) and [Targaryen](https://github.com/goldibex/targaryen).

## Setup
1. Install [Node.js](https://nodejs.org/en/download/)
2. Create a project on [Firebase](https://console.firebase.google.com/) and note down the Project ID
3. Replace the project id in the `.firebaserc` with your Project ID
4. Click **Add Firebase to your web app** and copy your Initialization Code
5. Replace the initialization code in the `environment/config.js` with your Initialization Code
6. Enable Email/Password & Anonymous sign-in providers in Authentication > SIGN-IN METHOD 
7. If using Travis CI:
    1. Create an account on [Travis CI](https://travis-ci.org/) and activate your repository
    2. Execute `npm install -g firebase-tools` followed by `firebase login:ci`
    3. Add FIREBASE_TOKEN to Settings > Environment Variables

## Install
```
npm install
```
## Start
```
npm start
```
<img width="218" src="https://cloud.githubusercontent.com/assets/358467/22717273/028426fe-ed92-11e6-8bf6-e1e3a96a94f7.png" /><img width="218" src="https://cloud.githubusercontent.com/assets/358467/22717329/5b67b2ae-ed92-11e6-9f92-dc786467044f.png" /><img width="218" src="https://cloud.githubusercontent.com/assets/358467/22717270/027db076-ed92-11e6-8979-87ed46122f2d.png" /><img width="218" src="https://cloud.githubusercontent.com/assets/358467/25335230/75addd96-28f2-11e7-8d9c-06f3348f8149.png" />

## Test
```
npm test
```
<img width="1200" alt="firebase-notes-tests" src="https://user-images.githubusercontent.com/358467/32831261-0f8040ca-c9f8-11e7-89c9-744e0f8ba9e2.png">

## Deploy

#### Command Line
Replace FIREBASE-PROJECT-ID with your Project ID and execute the following command.
```
export PROJECT=FIREBASE-PROJECT-ID && npm run deploy
```

#### Travis CI
Add `[deploy]` to you git commit message.

## Learn More

[Firebase Bolt](https://github.com/firebase/bolt)

[Firebase Realtime Database](https://firebase.google.com/docs/database/)

[Firebase Storage](https://firebase.google.com/docs/storage/)

[Vue.js](https://vuejs.org/)

[VueFire](https://github.com/vuejs/vuefire)

[Vue Material](https://vuematerial.github.io/)
