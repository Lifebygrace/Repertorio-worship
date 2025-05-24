import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDahT6IuQwSYdpAMcPpAERpqVuobmqmVSQ",
  authDomain: "repertorioworship.firebaseapp.com",
  projectId: "repertorioworship",
  storageBucket: "repertorioworship.firebasestorage.app",
  messagingSenderId: "493050453266",
  appId: "1:493050453266:web:cf07ce9fbb471122f167cb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cargarCanciones() {
  const contenedor = document.getElementById("lista-canciones");
  contenedor.innerHTML = "";
  const search = document.getElementById("search").value.toLowerCase();
  const querySnapshot = await getDocs(collection(db, "canciones"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (!data.titulo.toLowerCase().includes(search)) return;
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h2>${data.titulo}</h2>
      <p>${data.acordes}</p>
      ${data.imagenes?.map(url => `<img src="${url}" alt="Acordes">`).join('') || ""}
      ${data.audio ? `<p><a href="${data.audio}" target="_blank">🎧 Escuchar Audio</a></p>` : ""}
      ${data.youtube ? `<p><a href="${data.youtube}" target="_blank">▶ Ver en YouTube</a></p>` : ""}
      <details><summary>Opciones</summary>
        <button onclick="eliminarCancion('${docSnap.id}')">🗑️ Eliminar</button>
      </details>
    `;
    contenedor.appendChild(div);
  });
}

window.agregarCancion = async function () {
  const titulo = document.getElementById("titulo").value;
  const acordes = document.getElementById("acordes").value;
  const youtube = document.getElementById("youtube").value;
  const audio = document.getElementById("audio").value;
  const imagenesRaw = document.getElementById("imagenes").value;
  const imagenes = imagenesRaw.split(',').map(url => url.trim()).filter(url => url !== "");
  if (titulo.trim() === "") return;
  await addDoc(collection(db, "canciones"), { titulo, acordes, youtube, audio, imagenes });
  document.getElementById("formulario").reset();
  document.getElementById("formulario").style.display = "none";
  cargarCanciones();
};

window.eliminarCancion = async function (id) {
  await deleteDoc(doc(db, "canciones", id));
  cargarCanciones();
};

window.toggleForm = function () {
  const form = document.getElementById("formulario");
  form.style.display = form.style.display === "none" ? "block" : "none";
};

window.onload = () => {
  cargarCanciones();
  document.getElementById("search").addEventListener("input", cargarCanciones);
};
