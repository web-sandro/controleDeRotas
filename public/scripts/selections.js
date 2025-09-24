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
            // define dx, dy diretamente
            if (ev === 'right') { dx = 1; dy = 0; }     // mover para direita
            else if (ev === 'left') { dx = -1; dy = 0; } // mover para esquerda
            else if (ev === 'up') { dx = 0; dy = -1; }   // mover para cima
            else if (ev === 'down') { dx = 0; dy = 1; }  // mover para baixo
            else if (ev === 'back') { dx = -dx; dy = -dy; } // volta
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
                const dir = document.getElementById('startDir').value;
                if (dir === 'right') { dx = 1; dy = 0; }
                else if (dir === 'left') { dx = -1; dy = 0; }
                else if (dir === 'up') { dx = 0; dy = -1; }
                else if (dir === 'down') { dx = 0; dy = 1; }
                animationTimer = setInterval(runLight, 120);
            }
        }

        function toggleAnimation() {
            if (animationTimer) stopAnimation();
            else startAnimation();
        }

        function stopAnimation() { clearInterval(animationTimer); animationTimer = null; document.querySelectorAll('.cell.active').forEach(c => c.classList.remove('active')); }

        function toggleCellSelection(n, eventType = null) {
            const cell = document.querySelector(`.cell[data-num='${n}']`);
            if (!cell) return;
            if (selectedMap.has(n)) { selectedMap.delete(n); cell.classList.remove('selected'); cell.textContent = n; }
            else {
                const ev = eventType || document.getElementById('eventSelect').value;
                selectedMap.set(n, ev); cell.classList.add('selected'); cell.textContent = arrows[ev];
            }
        }

        function setStart() {
            const startNum = parseInt(document.getElementById('startInput').value);
            if (startNum >= 1 && startNum <= TOTAL) { const pos = numToPos(startNum); row = pos.r; col = pos.c; }
        }

        async function loadSavedSelections() {
            const res = await fetch('/api/selections'); const data = await res.json();
            const sel = document.getElementById('savedSelect'); sel.innerHTML = '<option value="">-- Selecione --</option>';
            data.forEach(item => { const opt = document.createElement('option'); opt.value = item.id; opt.textContent = item.name; sel.appendChild(opt); });
        }

        async function loadSaved() {
            const selId = document.getElementById('savedSelect').value; if (!selId) return;
            selectedMap.clear();
            document.querySelectorAll('.cell.selected').forEach(c => { c.classList.remove('selected'); c.textContent = c.dataset.num; });
            const res = await fetch(`/api/selections/${selId}`);
            const data = await res.json();
            data.forEach(item => {
                const cell = document.querySelector(`.cell[data-num='${item.num}']`);
                if (cell) { selectedMap.set(item.num, item.event); cell.classList.add('selected'); cell.textContent = arrows[item.event] || item.num; }
            });
        }

        document.getElementById('applyBtn').addEventListener('click', () => {
            // pega os números do input
            const nums = document.getElementById('numbersInput').value
                .split(',')
                .map(v => parseInt(v.trim()))
                .filter(v => v >= 1 && v <= TOTAL);

            const ev = document.getElementById('eventSelect').value;

            nums.forEach(n => toggleCellSelection(n, ev));

            // Limpa o input para a próxima inserção
            document.getElementById('numbersInput').value = '';
        });


        document.getElementById('clearBtn').addEventListener('click', () => {
            selectedMap.clear();
            document.querySelectorAll('.cell.selected').forEach(c => { c.classList.remove('selected'); c.textContent = c.dataset.num; });
        });

        document.getElementById('saveBtn').addEventListener('click', async () => {
            const name = document.getElementById('saveName').value.trim();
            if (!name) return alert("Digite um nome para a seleção.");
            const data = [];
            selectedMap.forEach((event, num) => { data.push({ num, event }); });
            if (data.length === 0) return alert("Nenhuma célula selecionada para salvar.");
            const res = await fetch('/api/selections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, items: data })
            });
            const result = await res.json();
            if (result.success) { alert("Seleção salva com sucesso!"); loadSavedSelections(); }
            else alert("Erro ao salvar a seleção.");
        });

        let intervalId = null;
        let currentCell = 0;
        let currentDirection = 'right'; // direção padrão inicial
        let isPaused = false;

        const gridSize = 10; // exemplo 10x10
        const cells = document.querySelectorAll('.cell');

        function moveHighlight() {
            cells.forEach(c => c.classList.remove('active'));

            if (currentDirection === 'right') {
                currentCell = (currentCell + 1) % (gridSize * gridSize);
            } else if (currentDirection === 'left') {
                currentCell = (currentCell - 1 + gridSize * gridSize) % (gridSize * gridSize);
            } else if (currentDirection === 'up') {
                currentCell = (currentCell - gridSize + gridSize * gridSize) % (gridSize * gridSize);
            } else if (currentDirection === 'down') {
                currentCell = (currentCell + gridSize) % (gridSize * gridSize);
            }

            cells[currentCell].classList.add('active');
        }

        // botão para escolher direção manualmente
        document.querySelectorAll('.btn-direcao').forEach(btn => {
            btn.addEventListener('click', () => {
                currentDirection = btn.dataset.dir; // "right" | "left" | "up" | "down"
            });
        });

        generateGrid();
        loadSavedSelections();