:root { --neon: #ff0000; --bg: #000; }

body {
    background: var(--bg);
    color: var(--neon);
    font-family: 'Courier New', monospace;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
}

/* FORCES CARDS TO BE SIDE-BY-SIDE */
#grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    width: 90%;
    margin-top: 20px;
}

.card {
    border: 1px solid var(--neon);
    padding: 15px;
    width: 120px;
    text-align: center;
    cursor: pointer;
    background: rgba(255, 0, 0, 0.05);
}

.card:hover {
    background: var(--neon);
    color: #000;
}

.glitch {
    font-size: 3rem;
    text-align: center;
    text-transform: uppercase;
}

.action-btn {
    background: var(--neon);
    color: #000;
    border: none;
    padding: 10px 20px;
    font-weight: bold;
    margin: 5px;
    cursor: pointer;
}

.cyber-btn {
    background: transparent;
    border: 1px solid var(--neon);
    color: var(--neon);
    padding: 5px 10px;
    margin: 5px;
}
