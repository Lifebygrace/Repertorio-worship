
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, deleteDoc, doc, setDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import {
  getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// ConfiguraciÃ³n Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDahT6IuQwSYdpAMcPpAERpqVuobmqmVSQ",
  authDomain: "repertorioworship.firebaseapp.com",
  projectId: "repertorioworship",
  storageBucket: "repertorioworship.appspot.com",
  messagingSenderId: "493050453266",
  appId: "1:493050453266:web:cf07ce9fbb471122f167cb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// UID del administrador
let adminUID = "Wac5yk1NUQNY1fSARyOxRjacLPV2";

// Estado global
let usuarioActual = null;

// Iniciar sesiÃ³n
export function iniciarSesion() {
  signInWithPopup(auth, provider)
    .then((result) => {
      usuarioActual = result.user;
      verificarAcceso();
    });
}

// Cerrar sesiÃ³n
export function cerrarSesion() {
  signOut(auth).then(() => {
    usuarioActual = null;
    verificarAcceso();
  });
}

// Verificar si es admin
function verificarAcceso() {
  const esAdmin = usuarioActual?.uid === adminUID;
  document.body.classList.toggle("admin", esAdmin);

  document.getElementById("btn-agregar").style.display = esAdmin ? "inline-block" : "none";
  document.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.style.display = esAdmin ? "inline-block" : "none";
  });
  document.getElementById("btn-editar-notas").style.display = esAdmin ? "inline-block" : "none";

  document.getElementById("boton-login").style.display = usuarioActual ? "none" : "inline-block";
  document.getElementById("boton-logout").style.display = usuarioActual ? "inline-block" : "none";
}

// Escuchar cambios de autenticaciÃ³n
onAuthStateChanged(auth, (user) => {
  usuarioActual = user;
  verificarAcceso();
});
