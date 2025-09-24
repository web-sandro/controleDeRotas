const db = require('../db');

// Busca todos os eventos
async function getAllEvents() {
  const [rows] = await db.query('SELECT * FROM events ORDER BY cell_number ASC');
  return rows;
}

// Insere ou atualiza eventos
async function upsertEvents(events) {
  const values = events.map(e => [e.cell_number, e.event_type]);
  await db.query(
    `INSERT INTO events (cell_number, event_type) VALUES ? 
     ON DUPLICATE KEY UPDATE event_type = VALUES(event_type)`,
    [values]
  );
}

module.exports = { getAllEvents, upsertEvents };
