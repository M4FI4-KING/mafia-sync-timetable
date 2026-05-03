import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getDatabase, ref, set, onValue, onDisconnect } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDkWghikz4GXXeBtwlh0xyBdmii7Ks-suI",
  authDomain: "mafiasync-ec7d0.firebaseapp.com",
  projectId: "mafiasync-ec7d0",
  storageBucket: "mafiasync-ec7d0.firebasestorage.app",
  messagingSenderId: "788300403687",
  appId: "1:788300403687:web:46b80429810ac58001a342",
  measurementId: "G-9Y2DE95TNH",
  databaseURL: "https://mafiasync-ec7d0-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

const subjects = ["සිංහල", "විද්‍යාව", "ගණිතය", "ඉතිහාසය", "සංගීතය", "ඉංග්‍රීසි", "I.C.T", "Commerce", "බුද්ධ ධර්මය"];
const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
let studySeconds = 0;
let timerInterval;

// --- AUTH & RADAR SYNC ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        const username = user.email.split('@')[0].toUpperCase();
        document.getElementById('loginBtn').innerText = username;

        const statusRef = ref(rtdb, 'status/' + username);
        set(statusRef, { state: 'online', last_changed: Date.now() });
        onDisconnect(statusRef).remove();

        if (username === "MAFIAKING") unlockAdmin();
        setupLiveRadar();
    }
});

function setupLiveRadar() {
    const statusRef = ref(rtdb, 'status');
    onValue(statusRef, (snapshot) => {
        const data = snapshot.val();
        const list = document.getElementById('playerList');
        if (!list || !data) return;
        list.innerHTML = "";
        Object.keys(data).forEach(u => {
            const color = data[u].state === 'STUDYING' ? '#ff3131' : '#00ff41';
            list.innerHTML += `<div style="color:${color}; padding:10px; border-bottom:1px solid #222;">● ${u} [${data[u].state}]</div>`;
        });
    });
}

// --- TRACKER LOGIC ---
window.startStudy = () => {
    if (!auth.currentUser) return alert("LOGIN REQUIRED");
    const u = auth.currentUser.email.split('@')[0].toUpperCase();
    set(ref(rtdb, 'status/' + u), { state: 'STUDYING', last_changed: Date.now() });
    timerInterval = setInterval(() => { studySeconds++; updateDisplay(); }, 1000);
};

window.stopStudy = async () => {
    clearInterval(timerInterval);
    if (!auth.currentUser) return;
    const u = auth.currentUser.email.split('@')[0].toUpperCase();
    set(ref(rtdb, 'status/' + u), { state: 'online', last_changed: Date.now() });
    await setDoc(doc(db, "study_logs", u), { totalSeconds: studySeconds, date: new Date().toLocaleDateString() }, { merge: true });
    studySeconds = 0;
    updateDisplay();
};

function updateDisplay() {
    const h = Math.floor(studySeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((studySeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (studySeconds % 60).toString().padStart(2, '0');
    document.getElementById('timerDisplay').innerText = `SESSION: ${h}:${m}:${s}`;
}

// --- UTILITIES ---
window.login = async () => {
    const uVal = document.getElementById('user').value.trim();
    const pass = document.getElementById('pass').value.trim();
    const email = uVal.includes('@') ? uVal : `${uVal.toLowerCase()}@mafia.com`;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        window.toggleModal('loginModal');
    } catch (e) { alert("ERROR: " + e.message); }
};

window.toggleModal = (id) => {
    const m = document.getElementById(id);
    m.style.display = (m.style.display === 'flex') ? 'none' : 'flex';
};

function unlockAdmin() {
    if (document.getElementById('adminBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'adminBtn'; btn.innerText = "CORE_CONTROL"; btn.style.color = "gold";
    btn.onclick = () => alert("LVL 999: GitHub Source Access Granted.");
    document.getElementById('topHeader').appendChild(btn);
}

// Grid Generation
const grid = document.getElementById('grid');
days.forEach((day, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<span class="day-name">${day}</span><p>${subjects[i % 9]}</p>`;
    grid.appendChild(card);
});

setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString(); }, 1000);
