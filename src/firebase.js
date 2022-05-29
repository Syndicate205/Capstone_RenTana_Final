import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { getStorage } from "firebase/storage"
//import database from "firebase/compat/database"

//const app = firebase.initializeApp({
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIRABASE_API_KEY,
    authDomain: process.env.REACT_APP_FIRABASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIRABASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIRABASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EACT_APP_FIRABASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIRABASE_APP_ID 
}
//})

const app = firebase.initializeApp(firebaseConfig);
const storage = getStorage()
const auth = firebase.auth()

export {storage, auth, app as default};