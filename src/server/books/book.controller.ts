import express from 'express';
import { bookRequestHandler } from './book.requestHandler';
const { create, getAll, getById, update, delete: _delete } = bookRequestHandler;
const router = express();

// Mount routes
router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;
