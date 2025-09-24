const db = require('../db');

// Cria seleção + itens
async function saveSelection(name, items) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [res] = await conn.query('INSERT INTO selections (name) VALUES (?)', [name]);
    const selectionId = res.insertId;

    if (items.length > 0) {
      const placeholders = items.map(() => '(?, ?, ?)').join(',');
      const values = items.flatMap(i => [selectionId, i.num, i.event]);
      await conn.query(
        `INSERT INTO selection_items (selection_id, num, event) VALUES ${placeholders}`,
        values
      );
    }

    await conn.commit();
    return selectionId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// Lista seleções
async function getSelections() {
  const [rows] = await db.query('SELECT id, name, created_at FROM selections ORDER BY created_at DESC');
  return rows;
}

// Busca itens de uma seleção
async function getSelectionItems(selectionId) {
  const [rows] = await db.query(
    'SELECT num, event FROM selection_items WHERE selection_id = ?',
    [selectionId]
  );
  return rows;
}

module.exports = { saveSelection, getSelections, getSelectionItems };
