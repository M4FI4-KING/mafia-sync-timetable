import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

// --- AUTH & ADMIN 999[cite: 1] ---
window.login = async () => {
    const u = document.getElementById('user').value.toLowerCase();
    const p = document.getElementById('pass').value;
    try {
        await signInWithEmailAndPassword(auth, `${u}@mafia.com`, p);
        toggleModal('loginModal');
    } catch (e) { alert("ACCESS_DENIED"); }
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        const username = user.email.split('@')[0].toUpperCase();
        document.getElementById('loginBtn').innerText = username;
        
        // Admin Unlock[cite: 1]
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
    btn.style.color = "gold";
    btn.onclick = () => alert("ADMIN_CORE_ACTIVE");
    document.getElementById('topHeader').appendChild(btn);
}

// --- GRID & CLOCK ---
const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const grid = document.getElementById('grid');
days.forEach(d => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<strong>${d}</strong>`;
    card.onclick = () => alert("SYNCING_" + d);
    grid.appendChild(card);
});

setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}, 1000);
