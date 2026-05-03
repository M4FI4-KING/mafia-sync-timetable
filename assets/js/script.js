// Functionality and Firebase setup stays the same as previous step
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
    card.innerHTML = `
        <div class="day-title">${item.day}</div>
        <div class="sub-item">${item.s1}</div>
        <div class="sub-item">${item.s2}</div>
    `;
    grid.appendChild(card);
});

// Timer Logic
let startTime;
let timerInterval;

window.startStudy = () => {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const diff = Date.now() - startTime;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        document.getElementById('timerDisplay').innerText = 
            `SESSION: ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }, 1000);
};

window.stopStudy = () => {
    clearInterval(timerInterval);
};

setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString('en-GB');
}, 1000);
