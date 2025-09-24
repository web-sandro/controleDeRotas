const eventModel = require('../models/eventModel');

// View principal
async function index(req, res) {
  res.render('index');
}

// Retorna JSON com eventos
async function listEvents(req, res) {
  try {
    const events = await eventModel.getAllEvents();
    res.json({ success: true, events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao obter eventos' });
  }
}

// Recebe e salva array de eventos
async function createOrUpdateEvents(req, res) {
  try {
    const { events } = req.body;
    if (!Array.isArray(events) || events.length === 0)
      return res.status(400).json({ success: false, message: 'Nenhum evento recebido' });
    if (events.length > 50)
      return res.status(400).json({ success: false, message: 'Máximo 50 eventos permitidos' });

    for (const e of events) {
      if (!Number.isInteger(e.cell_number) || e.cell_number < 1 || e.cell_number > 10000)
        return res.status(400).json({ success: false, message: `Número de célula inválido: ${e.cell_number}` });
      if (!['right', 'left', 'back'].includes(e.event_type))
        return res.status(400).json({ success: false, message: 'Tipo de evento inválido' });
    }

    await eventModel.upsertEvents(events);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao salvar eventos' });
  }
}

module.exports = { index, listEvents, createOrUpdateEvents };
