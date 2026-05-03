import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getDatabase, ref, set, onValue, onDisconnect } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// Your verified configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkWghikz4GXXeBtwlh0xyBdmii7Ks-suI",
  authDomain: "mafiasync-ec7d0.firebaseapp.com",
  projectId: "mafiasync-ec7d0",
  storageBucket: "mafiasync-ec7d0.firebasestorage.app",
  messagingSenderId: "788300403687",
  appId: "1:788300403687:web:46b80429810ac58001a342",
  measurementId: "G-9Y2DE95TNH",
  databaseURL: "https://mafiasync-ec7d0-default-rtdb.firebaseio.com" // Added for Live Radar
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

// Local Data
const subjects = ["සිංහල", "විද්‍යාව", "ගණිතය", "ඉතිහාසය", "සංගීතය", "ඉංග්‍රීසි", "I.C.T", "Commerce", "බුද්ධ ධර්මය"];
const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

let studySeconds = 0;
let timerInterval;

// --- 1. LOGIN LOGIC ---
window.login = async () => {
    const emailInput = document.getElementById('user').value.trim();
    const pass = document.getElementById('pass').value.trim();

    // If you used "MAFIAKING" as the login, we add the domain automatically
    const email = emailInput.includes('@') ? emailInput : `${emailInput.replace(/\s+/g, '')}@mafia.com`.toLowerCase();

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        window.toggleModal('loginModal');
    } catch (error) {
        alert("ACCESS DENIED: " + error.message);
    }
};

// --- 2. AUTH STATE (Theme & Presence) ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        const username = user.email.split('@')[0].toUpperCase();
        document.getElementById('loginBtn').innerText = `${username}`;

        // Real-time Presence: Mark Online
        const userStatusRef = ref(rtdb, 'status/' + username);
        set(userStatusRef, { state: 'online', last_changed: Date.now() });
        onDisconnect(userStatusRef).set({ state: 'offline', last_changed: Date.now() });

        // Apply Personal Themes (Level 999 vs 69)
        if (username === "MAFIAKING") {
            document.body.className = "theme-red";
            unlockAdmin();
        } else if (username === "MAFIADEVIL") {
            document.body.className = "theme-blue";
        }
    }
});

// --- 3. LIVE RADAR (Network Players) ---
function setupLiveRadar() {
    const statusRef = ref(rtdb, 'status');
    onValue(statusRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        
        console.log("System Status Update:", data);
        // This is where you'd update your "Who's Studying" UI
    });
}
setupLiveRadar();

// --- 4. STUDY TRACKER ---
window.startStudy = () => {
    if (!auth.currentUser) return alert("SYSTEM ERROR: Login Required");
    
    const username = auth.currentUser.email.split('@')[0].toUpperCase();
    set(ref(rtdb, 'status/' + username), { state: 'STUDYING', last_changed: Date.now() });

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        studySeconds++;
        updateDisplay();
    }, 1000);
};

window.stopStudy = async () => {
    if (!auth.currentUser) return;
    
    const username = auth.currentUser.email.split('@')[0].toUpperCase();
    clearInterval(timerInterval);
    
    // Set status back to online
    set(ref(rtdb, 'status/' + username), { state: 'online', last_changed: Date.now() });

    // Save persistent log to Firestore
    await setDoc(doc(db, "study_logs", username), {
        totalSeconds: studySeconds,
        date: new Date().toLocaleDateString()
    }, { merge: true });

    alert(`SESSION_SYNCED: ${Math.floor(studySeconds / 60)}m ${studySeconds % 60}s`);
    studySeconds = 0;
    updateDisplay();
};

// --- 5. UI UTILITIES ---
function updateDisplay() {
    const h = Math.floor(studySeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((studySeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (studySeconds % 60).toString().padStart(2, '0');
    document.getElementById('timerDisplay').innerText = `SESSION: ${h}:${m}:${s}`;
}

window.toggleModal = (id) => {
    const m = document.getElementById(id);
    if(m) m.style.display = (m.style.display === 'flex') ? 'none' : 'flex';
};

function unlockAdmin() {
    if (!document.getElementById('adminBtn')) {
        const btn = document.createElement('button');
        btn.id = 'adminBtn';
        btn.className = 'btn';
        btn.style.color = "gold";
        btn.innerText = "CORE_CONTROL";
        btn.onclick = () => alert("LVL 999: GitHub Source Access Granted.");
        document.getElementById('topHeader').appendChild(btn);
    }
}

// Generate Timetable Cards
const grid = document.getElementById('grid');
days.forEach((day, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="day-name">${day}</div>
        <p>19:00: ${subjects[index % 9]}</p>
        <p>21:15: ${subjects[(index + 1) % 9]}</p>
    `;
    grid.appendChild(card);
});

// Live Clock
setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString('en-GB');
}, 1000);