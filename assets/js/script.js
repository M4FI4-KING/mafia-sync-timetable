const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const grid = document.getElementById('grid');

// Build the grid cards
days.forEach(d => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<strong>${d}</strong>`;
    card.onclick = () => alert("Selected: " + d);
    grid.appendChild(card);
});

// Simple Clock
setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}, 1000);

// Basic Button Logic
window.startStudy = () => { console.log("Started"); };
window.stopStudy = () => { console.log("Stopped"); };
