import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserLocalPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDkWghikz4GXXeBtwlh0xyBdmii7Ks-suI",
  authDomain: "mafiasync-ec7d0.firebaseapp.com",
  projectId: "mafiasync-ec7d0",
  storageBucket: "mafiasync-ec7d0.firebasestorage.app",
  messagingSenderId: "788300403687",
  appId: "1:788300403687:web:46b80429810ac58001a342",
  databaseURL: "https://mafiasync-ec7d0-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const subjects = ["සිංහල", "විද්‍යාව", "ගණිතය", "ඉතිහාසය", "සංගීතය", "ඉංග්‍රීසි", "I.C.T", "Commerce", "බුද්ධ ධර්මය"];
const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// --- LOGIN & THEMES ---
window.login = async () => {
    const uVal = document.getElementById('user').value.trim();
    const pass = document.getElementById('pass').value.trim();
    const remember = document.getElementById('rememberMe').checked;
    const email = `${uVal.toLowerCase()}@mafia.com`;

    try {
        await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
        await signInWithEmailAndPassword(auth, email, pass);
        toggleModal('loginModal');
    } catch (e) { alert("ERROR: ACCESS_DENIED"); }
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        const username = user.email.split('@')[0].toUpperCase();
        document.getElementById('loginBtn').innerText = username;

        // Auto-Theme
        if (username === "MAFIAKING") document.body.className = "theme-red";
        else if (username === "MAFIADEVIL") document.body.className = "theme-blue";

        // Level 999 Remote Sync
        onSnapshot(doc(db, "network", "theme_control"), (snap) => {
            if (snap.exists() && snap.data()[username]) {
                document.body.style.setProperty('--neon', snap.data()[username]);
            }
        });

        if (username === "MAFIAKING") unlockAdminPowers();
    }
});

// --- DYNAMIC POPUP RESIZE ---
window.openPopup = (type, data) => {
    const win = document.getElementById('popupWindow');
    const content = document.getElementById('popupContent');
    const title = document.getElementById('popupTitle');

    if (type === 'day') {
        win.style.width = "400px";
        title.innerText = `SCHEDULE: ${data}`;
        content.innerHTML = `
            <p>19:00 - 21:00: ${subjects[days.indexOf(data) % 9]}</p>
            <p>21:15 - 00:00: ${subjects[(days.indexOf(data) + 1) % 9]}</p>
            <button class="action-btn" onclick="openPopup('calendar', '${data}')">VIEW_CALENDAR</button>`;
    } else {
        win.style.width = "700px"; // RESIZES TO CALENDAR MODE[cite: 1]
        title.innerText = "STUDY_CALENDAR";
        content.innerHTML = `<p>History for ${data} loading from database...</p>`;
    }
    document.getElementById('mainPopup').style.display = 'flex';
};

// --- MODAL CONTROLS[cite: 1] ---
window.toggleModal = (id) => {
    const m = document.getElementById(id);
    m.style.display = (m.style.display === 'flex') ? 'none' : 'flex';
};

window.closePopupExternal = (e) => {
    if (e.target.className === 'modal-overlay') e.target.style.display = 'none';
};

// --- ADMIN 999[cite: 1] ---
function unlockAdminPowers() {
    if (document.getElementById('adminEntry')) return;
    const btn = document.createElement('button');
    btn.id = "adminEntry";
    btn.className = "cyber-btn";
    btn.style.color = "gold";
    btn.innerText = "CORE_999";
    btn.onclick = () => toggleModal('adminModal');
    document.getElementById('topHeader').appendChild(btn);
}

window.pushGlobalTheme = async () => {
    const target = document.getElementById('targetPlayer').value;
    const color = document.getElementById('colorPicker').value;
    await setDoc(doc(db, "network", "theme_control"), { [target]: color }, { merge: true });
    alert(`LEVEL 999: THEME UPDATED FOR ${target}`);
};

// Initialize Grid
const grid = document.getElementById('grid');
days.forEach(d => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<strong>${d}</strong>`;
    card.onclick = () => openPopup('day', d);
    grid.appendChild(card);
});

setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}, 1000);
