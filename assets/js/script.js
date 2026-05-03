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

// --- LOGIN & PERSISTENCE ---
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

        // Theme Level Check
        if (username === "MAFIAKING") document.body.className = "theme-red";
        else if (username === "MAFIADEVIL") document.body.className = "theme-blue";

        // Admin Power Listeners (Level 999)
        onSnapshot(doc(db, "network", "theme_control"), (snap) => {
            if (snap.exists() && snap.data()[username]) {
                document.body.style.setProperty('--neon', snap.data()[username]);
                document.body.style.setProperty('--glow', snap.data()[username] + '99');
            }
        });

        if (username === "MAFIAKING") unlockAdminPowers();
    }
});

// --- DYNAMIC RESIZING POPUP LOGIC[cite: 1] ---
window.openPopup = (type, data) => {
    const win = document.getElementById('popupWindow');
    const content = document.getElementById('popupContent');
    const title = document.getElementById('popupTitle');

    if (type === 'day') {
        win.style.width = "450px"; // Normal width
        title.innerText = `SCHEDULE: ${data}`;
        content.innerHTML = `
            <div class="pop-info">
                <p>19:00 - 21:00: ${subjects[days.indexOf(data) % 9]}</p>
                <p>21:15 - 00:00: ${subjects[(days.indexOf(data) + 1) % 9]}</p>
                <button class="cyber-btn" onclick="openPopup('calendar', '${data}')">VIEW_HISTORY_LOGS</button>
            </div>`;
    } else if (type === 'calendar') {
        win.style.width = "750px"; // Dynamic Resize to match content[cite: 1]
        title.innerText = "STUDY_CALENDAR_HISTORY";
        content.innerHTML = `<div class="calendar-view">Loading Player Logs for ${data}...</div>`;
    }
    document.getElementById('mainPopup').style.display = 'flex';
};

// --- LEVEL 999 ADMIN POWERS[cite: 1] ---
function unlockAdminPowers() {
    if (document.getElementById('adminEntry')) return;
    const btn = document.createElement('button');
    btn.id = "adminEntry";
    btn.className = "cyber-btn";
    btn.style.color = "gold";
    btn.innerText = "CORE_CONTROL_999";
    btn.onclick = () => toggleModal('adminModal');
    document.getElementById('topHeader').appendChild(btn);
}

window.pushGlobalTheme = async () => {
    const target = document.getElementById('targetPlayer').value;
    const color = document.getElementById('colorPicker').value;
    await setDoc(doc(db, "network", "theme_control"), { [target]: color }, { merge: true });
    alert(`LEVEL 999: ${target} THEME OVERWRITTEN.`);
};

// --- GRID & CLOCK ---
const grid = document.getElementById('grid');
days.forEach(d => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<strong>${d}</strong><br><small>TAP_FOR_INFO</small>`;
    card.onclick = () => openPopup('day', d);
    grid.appendChild(card);
});

setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}, 1000);

window.toggleModal = (id) => {
    const m = document.getElementById(id);
    m.style.display = (m.style.display === 'flex') ? 'none' : 'flex';
};
