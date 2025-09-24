const selectionModel = require('../models/selectionModel');

async function saveSelection(req, res) {
  try {
    const { name, items } = req.body;
    if (!name || !Array.isArray(items))
      return res.status(400).json({ success: false, message: 'Dados inválidos' });

    const id = await selectionModel.saveSelection(name, items);
    res.json({ success: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}

async function getSelections(req, res) {
  try {
    const rows = await selectionModel.getSelections();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function getSelectionItems(req, res) {
  try {
    const { id } = req.params;
    const rows = await selectionModel.getSelectionItems(id);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { saveSelection, getSelections, getSelectionItems };