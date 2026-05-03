import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserLocalPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getDatabase, ref, set, onValue, onDisconnect } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

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
const rtdb = getDatabase(app);

const subjects = ["සිංහල", "විද්‍යාව", "ගණිතය", "ඉතිහාසය", "සිංහල LIT", "ඉංග්‍රීසි", "I.C.T", "Commerce", "බුද්ධ ධර්මය"];
const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// --- LOGIN WITH REMEMBER ME ---
window.login = async () => {
    const uVal = document.getElementById('user').value.trim();
    const pass = document.getElementById('pass').value.trim();
    const remember = document.getElementById('rememberMe').checked;
    const email = `${uVal.toLowerCase()}@mafia.com`;

    try {
        // Set persistence based on checkbox[cite: 1]
        await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
        await signInWithEmailAndPassword(auth, email, pass);
        toggleModal('loginModal');
    } catch (e) { alert("ACCESS DENIED"); }
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        const name = user.email.split('@')[0].toUpperCase();
        document.getElementById('loginBtn').innerText = name;
        
        // Theme Logic[cite: 1]
        if (name === "MAFIAKING") document.body.className = "theme-red";
        else if (name === "MAFIADEVIL") document.body.className = "theme-blue";

        // Status Update
        set(ref(rtdb, 'status/' + name), { state: 'online' });
        onDisconnect(ref(rtdb, 'status/' + name)).remove();
        setupLiveRadar();
    }
});

// --- POP-UP SYSTEM ---
window.showDayDetail = (dayIndex) => {
    const title = document.getElementById('detailTitle');
    const body = document.getElementById('detailBody');
    
    // Resize/Update logic: if already open, it just changes content[cite: 1]
    title.innerText = `SCHEDULE: ${days[dayIndex]}`;
    body.innerHTML = `
        <p>19:00 - 21:00: ${subjects[dayIndex % 9]}</p>
        <p>21:15 - 00:00: ${subjects[(dayIndex + 1) % 9]}</p>
        <hr>
        <button onclick="showCalendar('${days[dayIndex]}')">VIEW_CALENDAR_HISTORY</button>
    `;
    document.getElementById('detailsModal').style.display = 'flex';
};

window.showCalendar = (day) => {
    const body = document.getElementById('detailBody');
    body.innerHTML = `<h3>LOGS FOR ${day}</h3><p>Checking database for study history...</p>`;
    // This "resizes" the existing popup instead of opening a new one[cite: 1]
};

// --- GRID GENERATION ---
const grid = document.getElementById('grid');
days.forEach((day, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<strong>${day}</strong><br>${subjects[i % 9]}`;
    card.onclick = () => showDayDetail(i);
    grid.appendChild(card);
});

window.toggleModal = (id) => {
    const m = document.getElementById(id);
    m.style.display = (m.style.display === 'flex') ? 'none' : 'flex';
};

setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}, 1000);
