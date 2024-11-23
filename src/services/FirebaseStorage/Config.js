
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB8RlWlJBdhqMSvtFCuwnQrWipUpwTbHFA",
  authDomain: "fruitshop-76590.firebaseapp.com",
  projectId: "fruitshop-76590",
  storageBucket: "fruitshop-76590.firebasestorage.app",
  messagingSenderId: "112870267027",
  appId: "1:112870267027:web:648fc19a63c534947c5566"
};


const app = initializeApp(firebaseConfig);

export const imageDb = getStorage(app);