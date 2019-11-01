import express from 'express';
import { creatorRequestHandler } from './creator.requestHandler';
const {
    create,
    getAll,
    getById,
    update,
    delete: _delete
} = creatorRequestHandler;
const router = express();

// Mount routes
router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;
