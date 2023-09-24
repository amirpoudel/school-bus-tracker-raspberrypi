
const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyDplNPIPiMT-VamK7yEMs9VdSSg0bBjlkk",
  authDomain: "school-bus-tracker-19436.firebaseapp.com",
  databaseURL: "https://school-bus-tracker-19436-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "school-bus-tracker-19436",
  storageBucket: "school-bus-tracker-19436.appspot.com",
  messagingSenderId: "1025379964376",
  appId: "1:1025379964376:web:08942450f2cd291e0b0ead",
  measurementId: "G-M5FRL8P4BG"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

module.exports = { database };
