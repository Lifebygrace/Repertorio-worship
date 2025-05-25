import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getFirestore, collection, getDocs, addDoc, deleteDoc,
  doc, onSnapshot, updateDoc, setDoc
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";
import {
  getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const cancionesRef = collection(db, "canciones");
const notasRef = doc(db, "global", "notas");
const form = document.getElementById("formulario");
const lista = document.getElementById("lista-canciones");
const toggleFormBtn = document.getElementById("toggleFormBtn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const editarNotasBtn = document.getElementById("editar-notas");
const notasTexto = document.getElementById("notas-texto");
const modalNotas = document.getElementById("modal-notas");
const guardarNotasBtn = document.getElementById("guardar-notas");
const textoNotas = document.getElementById("texto-notas");
const search = document.getElementById("search");
const contador = document.getElementById("contador-canciones");

let adminUID = "Wac5yk1NUQNY1fSARyOxRjacLPV2";
let usuarioActual = null;

onAuthStateChanged(auth, user => {
  usuarioActual = user;
  const esAdmin = user && user.uid === adminUID;
  toggleFormBtn.style.display = esAdmin ? "inline" : "none";
  logoutBtn.style.display = esAdmin ? "inline" : "none";
  loginBtn.style.display = esAdmin ? "none" : "inline";
  editarNotasBtn.style.display = esAdmin ? "inline" : "none";
});

loginBtn.addEventListener("click", () => signInWithPopup(auth, provider));
logoutBtn.addEventListener("click", () => signOut(auth));

toggleFormBtn.addEventListener("click", () => {
  form.style.display = form.style.display === "none" ? "block" : "none";
});

form.addEventListener("submit", async e => {
  e.preventDefault();
  if (!usuarioActual || usuarioActual.uid !== adminUID) {
    alert("No tienes permisos para agregar canciones.");
    return;
  }

  const titulo = document.getElementById("titulo").value;
  const acordes = document.getElementById("acordes").value;
  const imagenes = document.getElementById("imagenes").files;
  const audio = document.getElementById("audio").files[0];
  const youtube = document.getElementById("youtube").value;

  const imagenURLs = [];
  for (const img of imagenes) {
    const imgRef = ref(storage, `imagenes/${Date.now()}-${img.name}`);
    await uploadBytes(imgRef, img);
    const url = await getDownloadURL(imgRef);
    imagenURLs.push(url);
  }

  let audioURL = "";
  if (audio) {
    const audioRef = ref(storage, `audios/${Date.now()}-${audio.name}`);
    await uploadBytes(audioRef, audio);
    audioURL = await getDownloadURL(audioRef);
  }

  await addDoc(cancionesRef, {
    titulo, acordes, imagenes: imagenURLs, audio: audioURL, youtube
  });

  form.reset();
  form.style.display = "none";
});

onSnapshot(cancionesRef, snapshot => {
  lista.innerHTML = "";
  let canciones = [];
  snapshot.forEach(doc => canciones.push({ id: doc.id, ...doc.data() }));

  const filtro = search.value.toLowerCase();
  canciones = canciones.filter(c => c.titulo.toLowerCase().includes(filtro));
  contador.textContent = `Total de canciones: ${canciones.length}`;

  canciones.forEach(c => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${c.titulo}</h3>
      ${c.acordes ? `<details><summary>Ver acordes</summary><pre>${c.acordes}</pre></details>` : ""}
      ${c.youtube ? `<a href="${c.youtube}" target="_blank">🎬 Ver en YouTube</a><br>` : ""}
      ${c.audio ? `<audio controls src="${c.audio}"></audio>` : ""}
      ${c.imagenes?.map(url => `<img src="${url}" />`).join("") || ""}
      ${usuarioActual && usuarioActual.uid === adminUID ? `<button onclick="borrarCancion('${c.id}')">🗑 Eliminar</button>` : ""}
    `;
    lista.appendChild(div);
  });
});

window.borrarCancion = async id => {
  if (usuarioActual?.uid !== adminUID) {
    alert("No tienes permisos para borrar.");
    return;
  }
  await deleteDoc(doc(db, "canciones", id));
};

onSnapshot(notasRef, snap => {
  const data = snap.data();
  notasTexto.textContent = data?.texto || "Sin notas.";
  textoNotas.value = data?.texto || "";
});

editarNotasBtn.addEventListener("click", () => {
  modalNotas.style.display = "flex";
});

guardarNotasBtn.addEventListener("click", async () => {
  if (usuarioActual?.uid !== adminUID) return;
  await setDoc(notasRef, { texto: textoNotas.value });
  modalNotas.style.display = "none";
});

search.addEventListener("input", () => {
  // Se vuelve a renderizar con el filtro al recibir datos por onSnapshot
});

window.toggleDark = () => {
  document.body.classList.toggle("dark");
};
