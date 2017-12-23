// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase : {
    apiKey: "AIzaSyBnltNLjYG4nMAptSeKlr1CeUoV_QWX3Ps",
    authDomain: "randompoetry-1cacd.firebaseapp.com",
    databaseURL: "https://randompoetry-1cacd.firebaseio.com",
    projectId: "randompoetry-1cacd",
    storageBucket: "randompoetry-1cacd.appspot.com",
    messagingSenderId: "578952703372"
  }
};
