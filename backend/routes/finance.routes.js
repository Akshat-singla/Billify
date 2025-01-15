import { Router } from 'express';
import {
    addFinanceEntry,
    updateEntry,
    deleteEntry,
    getAllEntry,
} from '../controllers/finance.controlloers.js';
import verifyJWT from '../middlewares/auth.middlewares.js';
const financeRouter = Router();

financeRouter.post('/add', verifyJWT, addFinanceEntry);
financeRouter.get('/fetch', verifyJWT, getAllEntry);
financeRouter.patch('/update', verifyJWT, updateEntry);
financeRouter.delete('/delete', verifyJWT, deleteEntry);

export default financeRouter;
