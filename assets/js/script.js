import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, onSnapshot, setDoc, collection, addDoc, getDocs, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDkWghikz4GXXeBtwlh0xyBdmii7Ks-suI",
  authDomain: "mafiasync-ec7d0.firebaseapp.com",
  projectId: "mafiasync-ec7d0",
  storageBucket: "mafiasync-ec7d0.firebasestorage.app",
  messagingSenderId: "788300403687",
  appId: "1:788300403687:web:46b80429810ac58001a342"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let startTime, timerInterval;

// UI Toggle
window.toggleModal = (id) => {
    const m = document.getElementById(id);
    m.style.display = (m.style.display === 'flex') ? 'none' : 'flex';
};

// Login Logic
window.login = async () => {
    const e = document.getElementById('userEmail').value;
    const p = document.getElementById('userPass').value;
    try {
        await signInWithEmailAndPassword(auth, e, p);
        window.toggleModal('loginModal');
    } catch (err) { alert("FAIL: Check email/pass"); }
};

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        const name = user.email.split('@')[0].toUpperCase();
        document.getElementById('loginBtn').innerText = name;
        
        // ADMIN CHECK: Only mafiaking@gmail.com sees the button
        if(user.email === "mafiaking@gmail.com") {
            document.getElementById('adminBtn').style.display = "block";
        }

        // Presence Logic
        await setDoc(doc(db, "network", "players", "status", name), { online: true }, { merge: true });

        // Listen for Theme Force
        onSnapshot(doc(db, "network", "theme_control"), (snap) => {
            if(snap.exists() && snap.data()[name]) {
                document.body.style.setProperty('--neon', snap.data()[name]);
            }
        });
    }
});

// Timer Logic
window.startStudy = () => {
    if(!currentUser) return alert("LOGIN REQUIRED");
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
    if(!startTime) return;
    const mins = Math.floor((Date.now() - startTime) / 60000);
    await addDoc(collection(db, "study_logs"), {
        user: currentUser.email.split('@')[0].toUpperCase(),
        minutes: mins,
        timestamp: serverTimestamp()
    });
    alert(`SAVED: ${mins} Mins`);
    document.getElementById('timerDisplay').innerText = "SESSION: 00:00:00";
    startTime = null;
};

// Loaders
window.loadPlayers = async () => {
    const list = document.getElementById('playersList');
    list.innerHTML = "Scanning...";
    const snap = await getDocs(collection(db, "network/players/status"));
    list.innerHTML = "";
    snap.forEach(d => list.innerHTML += `<div>${d.id} - <span style="color:#0f0">ONLINE</span></div>`);
};

window.loadAdminData = async () => {
    const list = document.getElementById('allLogsList');
    list.innerHTML = "Fetching global data...";
    const snap = await getDocs(collection(db, "study_logs"));
    list.innerHTML = "";
    snap.forEach(d => list.innerHTML += `<div>[${d.data().user}] ${d.data().minutes} Mins</div>`);
};

window.overrideTheme = async () => {
    const target = document.getElementById('targetPlayer').value.toUpperCase();
    const color = document.getElementById('targetColor').value;
    await setDoc(doc(db, "network", "theme_control"), { [target]: color }, { merge: true });
    alert("DEPLOYED");
};

setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString('en-GB'); }, 1000);

// Add Grid
const schedule = [
    { day: "MON", s1: "19:00: සිංහල", s2: "21:15: විද්‍යාව" },
    { day: "TUE", s1: "19:00: විද්‍යාව", s2: "21:15: ගණිතය" },
    { day: "WED", s1: "19:00: ගණිතය", s2: "21:15: ඉතිහාසය" },
    { day: "THU", s1: "19:00: ඉතිහාසය", s2: "21:15: සංගීතය" },
    { day: "FRI", s1: "19:00: සංගීතය", s2: "21:15: ඉංග්‍රීසි" },
    { day: "SAT", s1: "19:00: ඉංග්‍රීසි", s2: "21:15: I.C.T" },
    { day: "SUN", s1: "19:00: I.C.T", s2: "21:15: Commerce" }
];
schedule.forEach(i => {
    grid.innerHTML += `<div class="card"><div class="day-title">${i.day}</div><div class="sub-item">${i.s1}</div><div class="sub-item">${i.s2}</div></div>`;
});
