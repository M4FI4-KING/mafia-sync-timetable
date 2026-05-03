import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

// --- ATTACH TO WINDOW TO FIX BUTTONS[cite: 1] ---
window.toggleModal = (id) => {
    const m = document.getElementById(id);
    if(m) m.style.display = (m.style.display === 'flex') ? 'none' : 'flex';
};

window.startStudy = () => {
    console.log("Session Started");
    document.getElementById('timerDisplay').innerText = "SESSION: ACTIVE";
};

window.stopStudy = () => {
    console.log("Session Stopped");
    document.getElementById('timerDisplay').innerText = "SESSION: 00:00:00";
};

window.login = async () => {
    const u = document.getElementById('user').value.toLowerCase();
    const p = document.getElementById('pass').value;
    try {
        await signInWithEmailAndPassword(auth, `${u}@mafia.com`, p);
        window.toggleModal('loginModal');
    } catch (e) { alert("ACCESS_DENIED"); }
};

// --- SUBJECT GRID GENERATOR[cite: 1] ---
const schedule = [
    { day: "MON", sub: "ENGLISH_LANG" },
    { day: "TUE", sub: "MATHEMATICS" },
    { day: "WED", sub: "SCIENCE_TECH" },
    { day: "THU", sub: "HISTORY_STU" },
    { day: "FRI", sub: "WEB_DEV_LAB" },
    { day: "SAT", sub: "CRYPTO_TRADE" },
    { day: "SUN", sub: "SYSTEM_MAINT" }
];

const grid = document.getElementById('grid');
schedule.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div style="font-size: 0.7rem; opacity: 0.6;">${item.day}</div>
        <div style="font-weight: bold;">${item.sub}</div>
    `;
    card.onclick = () => alert(`SYNCING_${item.sub}`);
    grid.appendChild(card);
});

// --- CLOCK & THEME SYNC ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        const username = user.email.split('@')[0].toUpperCase();
        document.getElementById('loginBtn').innerText = username;
        if (username === "MAFIAKING") unlockAdmin();
        
        onSnapshot(doc(db, "network", "theme_control"), (snap) => {
            if (snap.exists() && snap.data()[username]) {
                document.body.style.setProperty('--neon', snap.data()[username]);
            }
        });
    }
});

function unlockAdmin() {
    if (document.getElementById('adminBtn')) return;
    const btn = document.createElement('button');
    btn.id = "adminBtn";
    btn.className = "cyber-btn";
    btn.innerText = "CORE_999";
    btn.onclick = () => alert("CORE_999_STABLE");
    document.getElementById('topHeader').appendChild(btn);
}

setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}, 1000);
