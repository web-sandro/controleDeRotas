async function loadSavedSelections() {
  const res = await fetch("/api/selections");
  const data = await res.json();
  const sel = document.getElementById("savedSelect");
  sel.innerHTML = '<option value="">-- Selecione --</option>';
  data.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = item.name;
    sel.appendChild(opt);
  });
}

async function loadSaved() {
  const selId = document.getElementById("savedSelect").value;
  if (!selId) return;

  selectedMap.clear();
  document.querySelectorAll(".cell.selected").forEach(c => {
    c.classList.remove("selected");
    c.textContent = c.dataset.num;
  });

  const res = await fetch(`/api/selections/${selId}`);
  const data = await res.json();

  data.forEach(item => {
    const cell = document.querySelector(`.cell[data-num='${item.num}']`);
    if (cell) {
      selectedMap.set(item.num, item.event);
      cell.classList.add("selected");
      cell.textContent = arrows[item.event] || item.num;
    }
  });
}

document.getElementById("applyBtn").addEventListener("click", () => {
  const nums = document.getElementById("numbersInput").value
    .split(",")
    .map(v => parseInt(v.trim()))
    .filter(v => v >= 1 && v <= TOTAL);

  const ev = document.getElementById("eventSelect").value;
  nums.forEach(n => toggleCellSelection(n, ev));
  document.getElementById("numbersInput").value = "";
});

document.getElementById("clearBtn").addEventListener("click", () => {
  selectedMap.clear();
  document.querySelectorAll(".cell.selected").forEach(c => {
    c.classList.remove("selected");
    c.textContent = c.dataset.num;
  });
});

document.getElementById("saveBtn").addEventListener("click", async () => {
  const name = document.getElementById("saveName").value.trim();
  if (!name) return alert("Digite um nome para a seleção.");

  const data = [];
  selectedMap.forEach((event, num) => {
    data.push({ num, event });
  });
  if (data.length === 0) return alert("Nenhuma célula selecionada para salvar.");

  const res = await fetch("/api/selections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, items: data })
  });
  const result = await res.json();

  if (result.success) {
    alert("Seleção salva com sucesso!");
    loadSavedSelections();
  } else alert("Erro ao salvar a seleção.");
});

loadSavedSelections();
