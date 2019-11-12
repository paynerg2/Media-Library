import express from 'express';
import { gameRequestHandler } from './game.requestHandler';
const { create, getAll, getById, update, delete: _delete } = gameRequestHandler;
const router = express();

// Mount Routes
router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;
