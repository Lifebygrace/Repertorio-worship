import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, doc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDahT6IuQwSYdpAMcPpAERpqVuobmqmVSQ",
  authDomain: "repertorioworship.firebaseapp.com",
  projectId: "repertorioworship",
  storageBucket: "repertorioworship.firebasestorage.app",
  messagingSenderId: "493050453266",
  appId: "1:493050453266:web:cf07ce9fbb471122f167cb",
  measurementId: "G-RB3G81DQQ1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const adminUID = "Wac5yk1NUQNY1fSARyOxRjacLPV2";

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const editNotasBtn = document.getElementById("editar-notas-proximo");
const notasP = document.getElementById("notas-proximo");

loginBtn.onclick = () => signInWithPopup(auth, provider);
logoutBtn.onclick = () => signOut(auth);

onAuthStateChanged(auth, (user) => {
  if (user && user.uid === adminUID) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    editNotasBtn.style.display = "inline-block";
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    editNotasBtn.style.display = "none";
  }
});

async function cargarNotasProximo() {
  const docRef = doc(db, "notas", "proximo");
  const docSnap = await getDoc(docRef);
  notasP.textContent = docSnap.exists() ? docSnap.data().texto : "No hay notas aún.";
}

editNotasBtn.onclick = async () => {
  const nuevoTexto = prompt("Escribe las canciones para el próximo servicio:");
  if (nuevoTexto) {
    await setDoc(doc(db, "notas", "proximo"), { texto: nuevoTexto });
    cargarNotasProximo();
  }
};

cargarNotasProximo();