import express from 'express';
import {
    _delete,
    create,
    getAll,
    getById,
    update
} from './series.requestHandlers';

const router = express();

// Mount Routes
router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;
