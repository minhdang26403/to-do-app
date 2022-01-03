const firebaseConfig = {
  apiKey: "AIzaSyDd9RhXcJGvg1GIls1ubTpT0VP_Jc429XA",
  authDomain: "to-do-app-6d8db.firebaseapp.com",
  projectId: "to-do-app-6d8db",
  storageBucket: "to-do-app-6d8db.appspot.com",
  messagingSenderId: "62680119117",
  appId: "1:62680119117:web:4725d0d88751bd8397e904",
  measurementId: "G-C96626JBMF",
};

const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics(app);
var db = firebase.firestore();