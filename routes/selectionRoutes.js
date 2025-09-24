const express = require('express');
const router = express.Router();
const controller = require('../controllers/selectionController');

// POST salvar nova seleção
router.post('/', controller.saveSelection);

// GET listar seleções
router.get('/', controller.getSelections);

// GET carregar itens de uma seleção
router.get('/:id', controller.getSelectionItems);

module.exports = router;
