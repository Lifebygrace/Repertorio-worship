<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Repertorio Worship</title>
<style>
:root{
  --primary:#002244;--accent:#ff8c42;--bg:#f0f4f8;--text:#002244;
  --section-bg:#fff8e1;--card-bg:#ffffff;--edit-bg:#FFEB3B;
}
body.dark{--bg:#121212;--text:#f0f4f8;--card-bg:#1e1e1e;--section-bg:#2a2a2a;--edit-bg:#f9a825}
html,body{height:100%;margin:0;padding:0}
body{font-family:'Segoe UI',sans-serif;background:var(--bg);color:var(--text);transition:background .25s,color .25s}
header{background:var(--primary);color:#fff;padding:18px 20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}
.logo{display:flex;align-items:center;gap:12px}
.logo img{height:56px;border-radius:8px}
.controls{display:flex;gap:8px;align-items:center}
button{background:var(--accent);color:#fff;border:0;padding:6px 10px;border-radius:8px;cursor:pointer;font-weight:700}
button:hover{transform:scale(1.03)}
main{max-width:900px;margin:18px auto;padding:12px}
.card{background:var(--card-bg);padding:14px;border-radius:12px;box-shadow:0 2px 6px rgba(0,0,0,.08);margin-bottom:16px}
.section{background:var(--section-bg);padding:14px;border-radius:10px;margin-bottom:16px}
input[type="text"],textarea,input[type="date"]{width:100%;padding:10px;margin-bottom:10px;border-radius:8px;border:1px solid #ccc;background:transparent;color:inherit}
.search-container{position:relative;margin-bottom:16px}
#search{padding:14px 44px 14px 14px;border-radius:10px;border:2px solid var(--accent);font-size:1.05rem}
#clearSearch{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:transparent;border:0;color:var(--accent);font-size:1.2rem;display:none}
.link-btn{display:inline-block;background:var(--accent);color:#fff;padding:8px 12px;border-radius:8px;text-decoration:none}
.edit-banner{position:sticky;top:0;background:var(--edit-bg);padding:8px;text-align:center;font-weight:bold;display:none;z-index:50}
footer{text-align:center;margin-top:24px;padding:16px;display:flex;flex-direction:column;align-items:center;gap:10px;flex-wrap:wrap}
.preview-img {max-width: 350px;border-radius: 8px;margin: 8px 8px 0 0;display: inline-block;box-shadow: 0 0 6px rgba(0,0,0,0.15);}
.clear-btn {background-color: #e74c3c !important;color: white !important;border: none !important;border-radius: 6px !important;padding: 6px 12px !important;cursor: pointer !important;font-size: 14px !important;font-weight: bold !important;transition: background-color 0.2s ease, transform 0.1s ease !important;}
.clear-btn:hover {background-color: #c0392b;transform: scale(1.1);}
.clear-btn:active {transform: scale(0.95);}
.delete-btn {background-color: #e74c3c;color:white;border:none;border-radius:6px;padding:6px 12px;cursor:pointer;font-weight:bold;transition: background-color 0.2s ease, transform 0.1s ease;}
.delete-btn:hover {background-color:#c0392b;transform:scale(1.05);}
.delete-btn:active {transform:scale(0.95);}
</style>
</head>
<body>
<div class="edit-banner">✏️ Modo edición activo</div>

<header>
  <div class="logo">
    <img src="logo.jpeg" alt="Logo" />
    <h1 style="margin:0">Repertorio Worship</h1>
  </div>
  <div class="controls">
    <button onclick="toggleDark()">🌙 / ☀️</button>
    <button onclick="activarEdicion()">✏️ Editar</button>
    <button onclick="window.open('https://www.metronomeonline.com','_blank')">🕒 Metrónomo</button>
    <button id="toggleCancionesBtn" onclick="toggleCanciones()">🎵 Mostrar lista</button>
  </div>
</header>

<main>
  <div class="search-container">
    <input id="search" placeholder="🔍 Buscar canciones por título..." />
    <button id="clearSearch" class="clear-btn">✂️borrar❌</button>
  </div>

  <div class="section">
    <h2>🎶 Canciones para la semana</h2>
    <div id="contenedor-semana" style="display:none;">
      <input id="titulo-semana" placeholder="Título (ej. Semana del 7 al 13 de octubre)" />
      <textarea id="canciones-semana" placeholder="Canciones (una por línea)"></textarea>
      <button onclick="guardarSeccion('semana')">Guardar sección</button>
    </div>
    <div id="mostrar-semana" style="margin-top:8px"></div>
    <button id="btnWorshipPack" onclick="toggleWorshipPack()" style="margin-top:8px;">🎁 Worship Pack</button>
    <div id="worshipPackContainer" style="display:none; margin-top:12px;"></div>
  </div>

  <div class="section">
    <h2>🆕 Canciones nuevas del mes</h2>
    <div id="contenedor-mes" style="display:none;">
      <input id="titulo-mes" placeholder="Título (ej. Octubre 2025)" />
      <textarea id="canciones-mes" placeholder="Canciones (una por línea)"></textarea>
      <button onclick="guardarSeccion('mes')">Guardar sección</button>
    </div>
    <div id="mostrar-mes" style="margin-top:8px"></div>
  </div>

  <button id="btnAgregar" onclick="toggleFormulario()" style="display:none;">➕ Agregar nueva canción</button>

  <form id="formulario" onsubmit="event.preventDefault(); agregarCancion();" style="display:none;margin-top:12px;">
    <div class="card">
      <h2>Agregar canción</h2>
      <input id="titulo" placeholder="Título de la canción" required class="edit-input" />
      <textarea id="acordes" placeholder="Acordes..." class="edit-input"></textarea>
      <textarea id="imagenes" placeholder="Links de imágenes (uno por línea)" class="edit-input"></textarea>
      <input id="audio" placeholder="Link de audio" class="edit-input" />
      <input id="youtube" placeholder="Link de YouTube" class="edit-input" />
      <button type="submit">Guardar canción</button>
    </div>
  </form>

  <div id="lista-canciones" style="display:none;margin-top:12px;"></div>
</main>

<footer>
  <div id="contador-final" class="counter-badge">Canciones totales 🎶: 0</div>
  <button onclick="window.scrollTo({top:0, behavior:'smooth'})">⬆️ Volver al inicio</button>
</footer>

<script type="module">
// --- FIREBASE ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, onSnapshot, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

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

// --- ESTADO ---
let modoEdicion = false;
let cancionesCache = [];
let semanaCache = [];

// --- UTILIDADES ---
function normalizar(t){ return (t||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(); }

// --- INICIALIZACIÓN ---
function inicializarCanciones(){
  onSnapshot(collection(db,"canciones"), snap=>{
    cancionesCache = snap.docs.map(d=>({id:d.id,...d.data()}));
    actualizarContador();
    cargarCanciones();
  });
}
function actualizarContador(){
  document.getElementById("contador-final").textContent = `Canciones totales 🎶: ${cancionesCache.length||0}`;
}
function cargarCanciones(){
  const cont = document.getElementById("lista-canciones");
  cont.innerHTML="";
  cancionesCache.forEach(c=>cont.appendChild(construirCard(c)));
  cont.style.display = "block";
}
function construirCard(c){
  const div=document.createElement("div");
  div.className="card";
  div.innerHTML=`<h2>${c.titulo||""}</h2>
    <p>${c.acordes||""}</p>
    ${(c.imagenes||[]).map(u=>`<img src="${u}" style="width:100%;margin-top:8px;">`).join("")}
    ${(c.audio?`<a href="${c.audio}" target="_blank">🎧 Escuchar</a>`:"")}
    ${(c.youtube?`<a href="${c.youtube}" target="_blank">📺 YouTube</a>`:"")}`;
  return div;
}

// --- SECCIONES ---
async function cargarSeccion(tipo){
  try{
    const snap = await getDoc(doc(db,"secciones",tipo));
    const cont = document.getElementById(`mostrar-${tipo}`);
    if(snap.exists()){
      const data = snap.data();
      cont.innerHTML=`<h3>${data.titulo||""}</h3><ul>${(data.canciones||[]).map(t=>`<li>${t}</li>`).join("")}</ul>`;
      if(tipo==="semana") semanaCache = (data.canciones||[]).map(t=>normalizar(t));
    } else cont.innerHTML="<p>Aún no hay información guardada.</p>";
  }catch(e){console.error(e);}
}
async function guardarSeccion(tipo){
  const titulo=document.getElementById(`titulo-${tipo}`).value.trim();
  const canciones=document.getElementById(`canciones-${tipo}`).value.trim().split("\n").map(s=>s.trim()).filter(Boolean);
  await setDoc(doc(db,"secciones",tipo),{titulo,canciones});
  if(tipo==="semana") semanaCache=canciones.map(t=>normalizar(t));
  cargarSeccion(tipo);
  alert("Sección guardada ✅");
}

// --- AGREGAR CANCIONES ---
async function agregarCancion(){
  const titulo=document.getElementById("titulo").value.trim();
  if(!titulo)return alert("El título es obligatorio");
  await addDoc(collection(db,"canciones"),{
    titulo,
    acordes:document.getElementById("acordes").value.trim(),
    imagenes:document.getElementById("imagenes").value.trim().split("\n").map(s=>s.trim()).filter(Boolean),
    audio:document.getElementById("audio").value.trim(),
    youtube:document.getElementById("youtube").value.trim()
  });
  document.getElementById("formulario").reset();
  document.getElementById("formulario").style.display="none";
}

// --- MODO EDICIÓN ---
function activarEdicion(){
  if(!modoEdicion){
    const pin = prompt("Introduce el PIN para editar:");
    if(pin==="2025"){modoEdicion=true;document.querySelector(".edit-banner").style.display="block";document.getElementById("btnAgregar").style.display="block";alert("✏️ Modo edición activado");}
    else if(pin) return alert("PIN incorrecto");
  } else {modoEdicion=false;document.querySelector(".edit-banner").style.display="none";document.getElementById("btnAgregar").style.display="none";alert("🔒 Modo edición desactivado");}
}

// --- DARK MODE ---
function toggleDark(){document.body.classList.toggle("dark");}

// --- MOSTRAR WORSHIP PACK ---
function toggleWorshipPack(){
  const cont=document.getElementById("worshipPackContainer");
  const btn=document.getElementById("btnWorshipPack");
  if(cont.style.display==="block"){cont.style.display="none";btn.textContent="🎁 Worship Pack";return;}
  const cancionesSemana=cancionesCache.filter(c=>semanaCache.includes(normalizar(c.titulo)));
  cont.innerHTML=cancionesSemana.length?"<p></p>":"<p>No hay canciones guardadas esta semana.</p>";
  cancionesSemana.forEach(c=>cont.appendChild(construirCard(c)));
  cont.style.display="block";btn.textContent="❌ Cerrar pack";
}

// --- TOGGLE FORMULARIO ---
function toggleFormulario(){const f=document.getElementById("formulario");f.style.display=f.style.display==="none"?"block":"none";}

// --- CARGA INICIAL ---
document.addEventListener("DOMContentLoaded",()=>{
  inicializarCanciones();
  cargarSeccion("semana");
  cargarSeccion("mes");
  const searchInput=document.getElementById("search");
  const clearBtn=document.getElementById("clearSearch");
  searchInput.addEventListener("input",()=>{cargarCanciones();clearBtn.style.display=searchInput.value?"block":"none";});
  clearBtn.addEventListener("click",()=>{searchInput.value="";clearBtn.style.display="none";cargarCanciones();});
  window.agregarCancion=agregarCancion;
  window.guardarSeccion=guardarSeccion;
  window.activarEdicion=activarEdicion;
  window.toggleFormulario=toggleFormulario;
  window.toggleWorshipPack=toggleWorshipPack;
});
</script>
</body>
</html>