const GRID_ROWS = 100, GRID_COLS = 100, TOTAL = GRID_ROWS * GRID_COLS;
let row = 1, col = 1, dx = 1, dy = 0, animationTimer = null;
const selectedMap = new Map();

// set de arrows com diagonais
const arrows = {
  right: "→", left: "←", up: "↑", down: "↓", back: "⮌",
  downRight: "↘", downLeft: "↙", upLeft: "↖", upRight: "↗"
};

const canvas = document.getElementById("lightCanvas");
const ctx = canvas.getContext("2d");
let speed = 120;

// -------------------- Funções utilitárias --------------------
function posToNum(r, c) { return (r - 1) * GRID_COLS + c; }
function numToPos(num) { return { r: Math.floor((num - 1) / GRID_COLS) + 1, c: ((num - 1) % GRID_COLS) + 1 }; }


// -------------------- Geração da grid --------------------
function generateGrid() {
  const gridEl = document.getElementById("grid");
  gridEl.innerHTML = "";
  for (let i = 1; i <= TOTAL; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.num = i; // string aqui é ok, usaremos Number() quando necessário
    cell.textContent = i;
    // passamos o número (number) para o handler
    cell.addEventListener("click", () => toggleCellSelection(i));
    gridEl.appendChild(cell);
  }
}





function highlightCell(num, cssClass) {
    const cell = document.querySelector(`.cell[data-num='${num}']`);
    if (cell) { cell.classList.add(cssClass); setTimeout(() => cell.classList.remove(cssClass), 300); }
}

function turn(ev) {
  if (!ev) return;
  switch (ev) {
    case "right": dx = 1; dy = 0; break;
    case "left": dx = -1; dy = 0; break;
    case "up": dx = 0; dy = -1; break;
    case "down": dx = 0; dy = 1; break;
    case "downRight": dx = 1; dy = 1; break;
    case "downLeft": dx = -1; dy = 1; break;
    case "upLeft": dx = -1; dy = -1; break;
    case "upRight": dx = 1; dy = -1; break;
    case "back": dx = -dx; dy = -dy; break;
    default:
      // tenta normalizar variantes comuns (ex: "down-right" -> "downRight")
      const norm = String(ev).replace(/[-_\s]/g, "");
      if (["downRight","downLeft","upLeft","upRight"].includes(norm)) return turn(norm);
      // sem match -> nada
      break;
  }
}


// -------------------- Luz no canvas --------------------
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

// -------------------- Controle animação --------------------
function startAnimation() {
     if (!animationTimer) {
                const dir = document.getElementById('startDir').value;
                if (dir === 'right') { dx = 1; dy = 0; }
                else if (dir === 'left') { dx = -1; dy = 0; }
                else if (dir === 'up') { dx = 0; dy = -1; }
                else if (dir === 'down') { dx = 0; dy = 1; }
                animationTimer = setInterval(runLight, 120);
            }
}

function stopAnimation() {
    clearInterval(animationTimer);
    animationTimer = null;
    document.querySelectorAll('.cell.active').forEach(c => c.classList.remove('active'));
}

function toggleAnimation() { animationTimer ? stopAnimation() : startAnimation(); }
function increaseSpeed() { if (speed > 20) speed -= 20; resetInterval(); updateSpeedDisplay(); }
function decreaseSpeed() { speed += 20; resetInterval(); updateSpeedDisplay(); }
function resetInterval() {
  if (animationTimer) { clearInterval(animationTimer); animationTimer = setInterval(runLight, speed); }
}


function toggleCellSelection(n, eventType = null) {
  const key = Number(n); // garante number
  const cell = document.querySelector(`.cell[data-num='${key}']`);
  if (!cell) return;

  if (selectedMap.has(key)) {
    selectedMap.delete(key);
    cell.classList.remove("selected");
    cell.textContent = key;
    cell.removeAttribute("data-ev");
    cell.title = "";
    console.log(`removido ${key}`);
  } else {
    const ev = eventType || document.getElementById("eventSelect").value;
    selectedMap.set(key, ev); // armazenamos como number -> evento
    cell.classList.add("selected");
    cell.textContent = arrows[ev] || ev || "?";
    cell.dataset.ev = ev;
    cell.title = ev;
    console.log(`set ${key} -> ${ev}`);
  }
}

document.getElementById("applyBtn")?.addEventListener("click", () => {
  const raw = document.getElementById("numbersInput").value || "";
  const ev = document.getElementById("eventSelect").value;
  const nums = raw.split(",").map(s => s.trim()).filter(Boolean);
  nums.forEach(s => {
    const n = Number(s);
    if (!isNaN(n) && n >= 1 && n <= TOTAL) toggleCellSelection(n, ev);
  });
});

document.getElementById("clearBtn")?.addEventListener("click", () => {
  selectedMap.clear();
  document.querySelectorAll(".cell.selected").forEach(c => {
    c.classList.remove("selected");
    c.textContent = c.dataset.num;
    c.removeAttribute("data-ev");
    c.title = "";
  });
  console.log("limpou seleções");
});

function setStart() {
    const startNum = parseInt(document.getElementById('startInput').value);
    if (startNum >= 1 && startNum <= TOTAL) {
        const pos = numToPos(startNum);
        row = pos.r; col = pos.c;
    }
}

generateGrid();