import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
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

// --- MODAL CONTROLS ---
window.toggleModal = (id) => {
    const m = document.getElementById(id);
    m.style.display = (m.style.display === 'flex') ? 'none' : 'flex';
};

window.closePopupExternal = (e) => {
    if (e.target.className === 'modal-overlay') e.target.style.display = 'none';
};

// --- DYNAMIC RESIZE POPUP ---
window.openPopup = (type, data) => {
    const win = document.getElementById('popupWindow');
    const content = document.getElementById('popupContent');
    const title = document.getElementById('popupTitle');

    if (type === 'day') {
        win.style.width = "400px";
        title.innerText = `SESSION: ${data}`;
        content.innerHTML = `<p>TARGET: STUDYING_NOW</p><button class="action-btn" onclick="openPopup('calendar', '${data}')">VIEW_CALENDAR</button>`;
    } else {
        win.style.width = "750px"; // RESIZES LIVE
        title.innerText = "PLAYER_CALENDAR_HISTORY";
        content.innerHTML = `<p>History data for ${data} is syncing...</p>`;
    }
    document.getElementById('mainPopup').style.display = 'flex';
};

// --- ADMIN LEVEL 999 ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        const username = user.email.split('@')[0].toUpperCase();
        document.getElementById('loginBtn').innerText = username;
        if (username === "MAFIAKING") unlockAdminPowers();
        
        onSnapshot(doc(db, "network", "theme_control"), (snap) => {
            if (snap.exists() && snap.data()[username]) {
                document.body.style.setProperty('--neon', snap.data()[username]);
            }
        });
    }
});

function unlockAdminPowers() {
    if (document.getElementById('adminBtn')) return;
    const btn = document.createElement('button');
    btn.id = "adminBtn";
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
    alert("NETWORK THEME REWRITTEN");
};

// Init Grid
const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
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
