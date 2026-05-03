import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, onSnapshot, setDoc, collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

let currentUser = null;
let startTime, timerInterval;

// --- SUBJECT GRID GENERATOR ---
const schedule = [
    { day: "MON", s1: "19:00: සිංහල", s2: "21:15: විද්‍යාව" },
    { day: "TUE", s1: "19:00: විද්‍යාව", s2: "21:15: ගණිතය" },
    { day: "WED", s1: "19:00: ගණිතය", s2: "21:15: ඉතිහාසය" },
    { day: "THU", s1: "19:00: ඉතිහාසය", s2: "21:15: සංගීතය" },
    { day: "FRI", s1: "19:00: සංගීතය", s2: "21:15: ඉංග්‍රීසි" },
    { day: "SAT", s1: "19:00: ඉංග්‍රීසි", s2: "21:15: I.C.T" },
    { day: "SUN", s1: "19:00: I.C.T", s2: "21:15: Commerce" }
];

const grid = document.getElementById('grid');
schedule.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div class="day-title">${item.day}</div><div class="sub-item">${item.s1}</div><div class="sub-item">${item.s2}</div>`;
    grid.appendChild(card);
});

// --- UI CONTROLS ---
window.toggleModal = (id) => {
    const m = document.getElementById(id);
    m.style.display = (m.style.display === 'flex') ? 'none' : 'flex';
};

setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString('en-GB'); }, 1000);

// --- AUTH & SECURITY ENGINE ---
window.login = async () => {
    const u = document.getElementById('user').value;
    const p = document.getElementById('pass').value;
    try {
        await signInWithEmailAndPassword(auth, u, p);
        window.toggleModal('loginModal');
    } catch (e) { alert("ACCESS_DENIED: Invalid Credentials"); }
};

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        const username = user.email.split('@')[0].toUpperCase();
        document.getElementById('loginBtn').innerText = username;
        
        // 1. Set Online Status
        await setDoc(doc(db, "network", "players", "status", username), { online: true, lastLogin: new Date().toISOString() }, { merge: true });

        // 2. MAFIAKING SECURITY CHECK
        if (user.email === "mafiaking@gmail.com") {
            document.getElementById('adminBtn').style.display = 'block'; // Unlock Admin
        } else {
            document.getElementById('adminBtn').style.display = 'none'; // Lock out everyone else
        }

        // 3. Listen for forced theme changes
        onSnapshot(doc(db, "network", "theme_control"), (snap) => {
            if (snap.exists() && snap.data()[username]) {
                document.body.style.setProperty('--neon', snap.data()[username]);
            }
        });
    }
});

// --- STUDY TRACKER & SAVING ---
window.startStudy = () => {
    if(!currentUser) return alert("MUST LOGIN FIRST");
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const diff = Date.now() - startTime;
        const h = String(Math.floor(diff / 3600000)).padStart(2,'0');
        const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2,'0');
        document.getElementById('timerDisplay').innerText = `SESSION: ${h}:${m}:${s}`;
    }, 1000);
};

window.stopStudy = async () => {
    clearInterval(timerInterval);
    if (!currentUser || !startTime) return;
    
    const diff = Date.now() - startTime;
    const minutes = Math.floor(diff / 60000);
    
    // Save to Database
    try {
        await addDoc(collection(db, "study_logs"), {
            user: currentUser.email.split('@')[0].toUpperCase(),
            duration_minutes: minutes,
            date: new Date().toLocaleDateString(),
            timestamp: serverTimestamp()
        });
        alert(`SESSION_SAVED: ${minutes} Minutes Logged.`);
    } catch (e) {
        console.error(e);
        alert("ERROR_SAVING_DATA");
    }
    
    document.getElementById('timerDisplay').innerText = "SESSION: 00:00:00";
    startTime = null;
};

// --- RADAR & LOG READERS ---
window.loadMyLogs = async () => {
    if(!currentUser) return;
    const username = currentUser.email.split('@')[0].toUpperCase();
    const list = document.getElementById('myLogsList');
    list.innerHTML = "Fetching archives...";
    
    const q = query(collection(db, "study_logs"), where("user", "==", username));
    const snap = await getDocs(q);
    list.innerHTML = "";
    if(snap.empty) list.innerHTML = "No records found.";
    snap.forEach(doc => {
        const data = doc.data();
        list.innerHTML += `<div class="log-entry">${data.date} - ${data.duration_minutes} Mins</div>`;
    });
};

window.loadPlayers = async () => {
    const list = document.getElementById('playersList');
    list.innerHTML = "Scanning network...";
    const snap = await getDocs(collection(db, "network/players/status"));
    list.innerHTML = "";
    snap.forEach(doc => {
        const data = doc.data();
        const statusStr = data.online ? "<span style='color:#0f0'>[ONLINE]</span>" : "<span style='color:#f00'>[OFFLINE]</span>";
        list.innerHTML += `<div class="log-entry">${doc.id}: ${statusStr}</div>`;
    });
};

// --- ADMIN CONTROL FUNCTIONS ---
window.loadAdminData = async () => {
    const list = document.getElementById('allLogsList');
    list.innerHTML = "Fetching global logs...";
    const snap = await getDocs(collection(db, "study_logs")); // Gets EVERYONE'S logs
    list.innerHTML = "";
    snap.forEach(doc => {
        const data = doc.data();
        list.innerHTML += `<div class="log-entry">[${data.user}] ${data.date} - ${data.duration_minutes} Mins</div>`;
    });
};

window.overrideTheme = async () => {
    const targetUser = document.getElementById('targetPlayer').value.toUpperCase();
    const newColor = document.getElementById('targetColor').value;
    if(!targetUser) return alert("ENTER_TARGET_USERNAME");
    
    try {
        await setDoc(doc(db, "network", "theme_control"), {
            [targetUser]: newColor
        }, { merge: true });
        alert(`THEME_FORCED_ON: ${targetUser}`);
    } catch (e) { alert("OVERRIDE_FAILED"); }
};
