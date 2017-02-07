/* eslint-disable no-undef, no-unused-vars, no-unused-expressions */


const config = {
  apiKey: 'AIzaSyBXkQvHwMcJIULuK0D0PI9vryAVscrqfFM',
  authDomain: 'prototype-9c221.firebaseapp.com',
  databaseURL: 'https://prototype-9c221.firebaseio.com',
  storageBucket: 'prototype-9c221.appspot.com',
  messagingSenderId: '954671244432',
};

firebase.initializeApp(config);


/* ************************************************************ */


const timestamp = firebase.database.ServerValue.TIMESTAMP;


const sanitize = data => {
  const $data = {};

  Object.keys(data).forEach(k => {
    if (/^[^.$]/.test(k)) {
      $data[k] = data[k];
    }
  });

  return $data;
};


/* ************************************************************ */


Vue.use(VueMaterial);

const themes = {
  default: {
    primary: 'black',
    accent: 'grey',
    warn: 'red',
  },
  minimal: {
    primary: 'white',
    accent: 'black',
    warn: 'red',
  },
  error: {
    primary: 'red',
    accent: 'red',
    warn: 'red',
  },
};

Vue.material.registerTheme(themes);


/* ************************************************************ */


Vue.filter('capitalize', v => v.match(/[A-z][a-z]+/g).join(' ').replace(/^[a-z]/g, l => l.toUpperCase()));

Vue.filter('date', v => {
  const date = new Date(v);

  const t = `${date.getUTCHours() < 10 ? '0' : ''}${date.getUTCHours()}:${date.getUTCMinutes() < 10 ? '0' : ''}${date.getUTCMinutes()} `;
  const d = `${date.getUTCDate() < 10 ? '0' : ''}${date.getUTCDate()}/${date.getUTCMonth() < 10 ? '0' : ''}${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`;

  return `${t} ${d}`;
});


/* ************************************************************ */


const Scroller = {
  props: ['visible'],
  watch: {
    visible() {
      this.visible && this.scroll();
    },
  },

  mounted() {
    this.scroll();
  },

  updated() {
    this.scroll();
  },

  methods: {
    scroll() {
      this.$el.querySelector('li:last-child') && this.$el.querySelector('li:last-child').scrollIntoView({ block: 'start', behavior: 'instant' });
    },
  },
};


/* ************************************************************ */


const Auth = {
  template: `
    <form @submit.stop.prevent="submit">
      <md-input-container v-if="action === 'signUp'">
        <label>Name</label>
        <md-input required v-model="name"></md-input>
      </md-input-container>

      <md-input-container>
        <label>Email</label>
        <md-input required v-model="email" type="email"></md-input>
      </md-input-container>

      <md-input-container v-if="action !== 'resetPassword'" md-has-password>
        <label>Password</label>
        <md-input required v-model="password" type="password" pattern=".{6,}" title="6 characters minimum"></md-input>
      </md-input-container>

      <md-button type="submit" class="md-raised md-primary">{{ action | capitalize }}</md-button>

      <md-layout md-gutter>
        <md-layout v-if="action !== 'signIn'" md-align="center">
          <a @click="action = 'signIn'">Sign In</a>
        </md-layout>
        <md-layout v-if="action !== 'signUp'" md-align="center">
          <a @click="action = 'signUp'">Sign Up</a>
        </md-layout>
        <md-layout v-if="action !== 'resetPassword'" md-align="center">
          <a @click="action = 'resetPassword'">Reset Password</a>
        </md-layout>
      </md-layout>
    </form>
  `,

  data() {
    return {
      name: '',
      email: '',
      password: '',
      action: 'signIn',
    };
  },
  watch: {
    action() {
      this.$emit('action', this.action);
    },
  },

  created() {
    firebase
    .auth()
    .onAuthStateChanged(user => {
      this.$emit('user', user);
      user && this.$emit('message', { type: 'success', text: `Signed in as ${firebase.auth().currentUser.email}` });
    });
  },

  methods: {
    submit() {
      (this[this.action] || (() => {}))();
    },

    signIn() {
      firebase
      .auth()
      .signInWithEmailAndPassword(this.email, this.password)
      .catch(err => this.$emit('message', { type: 'error', text: err.message }));
    },
    signUp() {
      const profile = {
        displayName: this.name,
        photoURL: 'https://unsplash.it/300/?random',
      };

      firebase
      .auth()
      .createUserWithEmailAndPassword(this.email, this.password)
      .then(user =>
        user
        .updateProfile(profile)
        .then(() => user.reload())
      )
      .then(() => this.$emit('user', firebase.auth().currentUser))
      .catch(err => this.$emit('message', { type: 'error', text: err.message }));
    },
    resetPassword() {
      firebase
      .auth()
      .sendPasswordResetEmail(this.email)
      .then(() => this.$emit('message', { type: 'success', text: `Email sent to ${this.email}` }))
      .catch(err => this.$emit('message', { type: 'error', text: err.message }));
    },

    signOut() {
      firebase
      .auth()
      .signOut()
      .catch(err => this.$emit('message', { type: 'error', text: err.message }));
    },
  },
};

const Item = {
  template: `
    <div v-if="Object.keys(item).length">
      <pre>{{ item }}</pre>
      <button @click="set(item)">Set</button>
      <button @click="remove()">Remove</button>
    </div>
  `,

  props: ['path'],
  data() {
    return {
      item: {},
    };
  },
  watch: {
    path() {
      this.init();
    },
    item() {
      this.$emit('item', this.item);
    },
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      (this.$firebaseRefs || {}).item && this.$unbind('item');
      this.$bindAsObject('item', firebase.database().ref(this.path));
    },

    set(item) {
      this.$firebaseRefs.item.set(sanitize(item));
    },
    remove() {
      this.$firebaseRefs.item.remove();
    },
  },
};

const List = {
  template: `
    <ul v-if="list.length">
      <li v-for="item in list" :key="item['.key']">
        <pre>{{ item }}</pre>
        <button @click="set(item)">Set</button>
        <button @click="remove(item)">Remove</button>
      </li>
    </ul>
  `,

  props: ['path', 'size', 'order'],
  data() {
    return {
      list: [],
    };
  },
  watch: {
    path() {
      this.init();
    },
    size() {
      this.init();
    },
    order() {
      this.init();
    },
    list() {
      this.$emit('list', this.list);
    },
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      (this.$firebaseRefs || {}).list && this.$unbind('list');
      if (this.order) {
        this.$bindAsArray('list', firebase.database().ref(this.path).orderByChild(this.order).limitToLast(this.size));
      } else {
        this.$bindAsArray('list', firebase.database().ref(this.path).limitToLast(this.size));
      }
    },

    set(item) {
      this.$firebaseRefs.list.child(item['.key']).set(sanitize(item));
    },
    remove(item) {
      this.$firebaseRefs.list.child(item['.key']).remove();
    },
  },
};


/* ************************************************************ */


const Notes = {
  extends: List,
  mixins: [Scroller],

  template: `
    <section>
      <div v-if="!active">
        <md-list v-if="list.length" class="md-double-line">
          <md-list-item v-for="note in list" :key="note['.key']" @click="select(note)" disabled>
            <div class="md-list-text-container">
              <span class="md-text">{{ note.text }}</span>
              <span>{{ note.modified | date }}</span>
            </div>
            <md-icon>chevron_right</md-icon>
          </md-list-item>
        </md-list>
      </div>
      <div v-else class="md-item">
        <textarea v-model="active.modified.text" @focus="focus" @input="input" type="text" placeholder="Type here..." class="md-text"></textarea>
      </div>
    </section>
  `,

  data() {
    return {
      active: undefined,
    };
  },
  computed: {
    title() {
      return this.active ? this.active.modified.text : '';
    },
  },

  watch: {
    active() {
      this.$emit('section', this.active ? 'item' : 'list');
    },
  },

  methods: {
    focus(e) {
      window.scrollBy(0, 1);
    },
    input(e) {
      e.target.scrollTop = e.target.scrollHeight;
    },

    select(note = { text: '' }) {
      const original = Object.assign({}, note);
      const modified = Object.assign({}, note);

      if (!modified['.key']) {
        modified['.key'] = firebase.database().ref().push().key;
        modified.creator = firebase.auth().currentUser.uid;
        modified.created = timestamp;
      }

      this.active = { original, modified };
    },

    set() {
      if (this.active.original.text !== this.active.modified.text) {
        this.active.modified.modified = timestamp;
        this.$firebaseRefs.list.child(this.active.modified['.key']).set(sanitize(this.active.modified));
      }

      this.active = undefined;
    },
    remove() {
      if (this.active.original['.key']) {
        this.$firebaseRefs.list.child(this.active.original['.key']).remove();
      }

      this.active = undefined;
    },
  },
};


/* ************************************************************ */


const routes = {
  auth: {
    view: 'auth',
  },
  main: {
    view: 'main',
    section: 'list',
  },
};

const vm = new Vue({
  el: '#app',

  data: {
    route: routes.auth,
    theme: undefined,

    user: {},
    info: undefined,
  },
  watch: {
    theme() {
      this.$material.setCurrentTheme(themes[this.theme] ? this.theme : 'default');
    },
    user() {
      if (this.user) {
        this.route = routes.main;
      } else {
        this.route = routes.auth;
      }
    },
  },

  methods: {
    setUser(user) {
      this.user = user;
    },
    setInfo(message = {}) {
      this.$refs.snackbar.active && this.$refs.snackbar.close();
      this.theme = message.type;
      this.info = message.text;
      this.info && this.$refs.snackbar.open();
    },
  },

  components: {
    Auth,
    Notes,
  },
});
