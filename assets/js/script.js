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

// --- LOGIN & THEME SYNC ---
window.login = async () => {
    const uVal = document.getElementById('user').value.trim();
    const pass = document.getElementById('pass').value.trim();
    const email = `${uVal.toLowerCase()}@mafia.com`;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        toggleModal('loginModal');
    } catch (e) { alert("ACCESS_DENIED"); }
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        const username = user.email.split('@')[0].toUpperCase();
        document.getElementById('loginBtn').innerText = username;
        
        // Auto-Theme detection
        if (username === "MAFIAKING") document.body.className = "theme-red";
        else if (username === "MAFIADEVIL") document.body.className = "theme-blue";

        // Level 999 Remote Theme Override
        onSnapshot(doc(db, "network", "theme_control"), (snap) => {
            if (snap.exists() && snap.data()[username]) {
                document.body.style.setProperty('--neon', snap.data()[username]);
            }
        });
    }
});

// --- UI HELPERS ---
window.toggleModal = (id) => {
    const m = document.getElementById(id);
    m.style.display = (m.style.display === 'flex') ? 'none' : 'flex';
};

// Start/Stop Placeholder
window.startStudy = () => console.log("Timer Started");
window.stopStudy = () => console.log("Timer Stopped");

// Build Grid
const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const grid = document.getElementById('grid');
days.forEach(d => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<strong>${d}</strong>`;
    card.onclick = () => alert("DATA_SYNC_FOR_" + d);
    grid.appendChild(card);
});

// Clock Logic
setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}, 1000);
