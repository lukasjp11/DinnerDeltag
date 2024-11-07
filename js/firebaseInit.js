import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js';
import { getDatabase, ref, onValue, set } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyBPFLXo6mQXdcszXFVYaD-aCq-hRNmRjkw",
    authDomain: "dinnerdeltag.firebaseapp.com",
    projectId: "dinnerdeltag",
    storageBucket: "dinnerdeltag.appspot.com",
    messagingSenderId: "1390491301",
    appId: "1:1390491301:web:e4e61c46ed0ab5f7d5bf4c",
    databaseURL: "https://dinnerdeltag-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, set };
