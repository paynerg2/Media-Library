import express from 'express';
import {
    _delete,
    authenticate,
    register,
    getAll,
    getById,
    update
} from './user.requestHandlers';

const router = express();

// Mount Routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;
