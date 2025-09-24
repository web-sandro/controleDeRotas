const GRID_ROWS = 100, GRID_COLS = 100, TOTAL = GRID_ROWS * GRID_COLS;
let row = 1, col = 1, dx = 1, dy = 0, animationTimer = null;
const selectedMap = new Map();
const arrows = { right: "→", left: "←", up: "↑", down: "↓", back: "⮌" };

function posToNum(r, c) { return (r - 1) * GRID_COLS + c; }
function numToPos(num) { return { r: Math.floor((num - 1) / GRID_COLS) + 1, c: ((num - 1) % GRID_COLS) + 1 }; }

function generateGrid() {
    const gridEl = document.getElementById('grid');
    for (let i = 1; i <= TOTAL; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.num = i;
        cell.textContent = i;
        cell.addEventListener('click', () => toggleCellSelection(i));
        gridEl.appendChild(cell);
    }
}

function highlightCell(num, cssClass) {
    const cell = document.querySelector(`.cell[data-num='${num}']`);
    if (cell) { cell.classList.add(cssClass); setTimeout(() => cell.classList.remove(cssClass), 300); }
}

function turn(ev) {
    if (ev === 'right') { dx = 1; dy = 0; }
    else if (ev === 'left') { dx = -1; dy = 0; }
    else if (ev === 'up') { dx = 0; dy = -1; }
    else if (ev === 'down') { dx = 0; dy = 1; }
    else if (ev === 'back') { dx = -dx; dy = -dy; }
}

function runLight() {
    document.querySelectorAll('.cell.active').forEach(c => c.classList.remove('active'));
    const num = posToNum(row, col);
    const current = document.querySelector(`.cell[data-num='${num}']`);
    if (current) current.classList.add('active');
    if (selectedMap.has(num)) { const ev = selectedMap.get(num); highlightCell(num, 'trigger'); turn(ev); }
    row += dy; col += dx;
    if (row < 1) row = GRID_ROWS; if (row > GRID_ROWS) row = 1;
    if (col < 1) col = GRID_COLS; if (col > GRID_COLS) col = 1;
}

function startAnimation() {
    if (!animationTimer) {
        const dir = document.getElementById('startDir')?.value || 'right';
        turn(dir);
        animationTimer = setInterval(runLight, 120);
    }
}

function stopAnimation() {
    clearInterval(animationTimer);
    animationTimer = null;
    document.querySelectorAll('.cell.active').forEach(c => c.classList.remove('active'));
}

function toggleAnimation() { animationTimer ? stopAnimation() : startAnimation(); }

function toggleCellSelection(n, eventType = null) {
    const cell = document.querySelector(`.cell[data-num='${n}']`);
    if (!cell) return;
    if (selectedMap.has(n)) {
        selectedMap.delete(n);
        cell.classList.remove('selected');
        cell.textContent = n;
    } else {
        const ev = eventType || document.getElementById('eventSelect').value;
        selectedMap.set(n, ev);
        cell.classList.add('selected');
        cell.textContent = arrows[ev];
    }
}

function setStart() {
    const startNum = parseInt(document.getElementById('startInput').value);
    if (startNum >= 1 && startNum <= TOTAL) {
        const pos = numToPos(startNum);
        row = pos.r; col = pos.c;
    }
}

generateGrid();
    }