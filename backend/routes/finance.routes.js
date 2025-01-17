import { Router } from 'express';
import {
    addFinanceEntry,
    updateEntry,
    deleteEntry,
    getAllEntry,
} from '../controllers/finance.controlloers.js';
import verifyJWT from '../middlewares/auth.middlewares.js';
const financeRouter = Router();

financeRouter.post('/add', addFinanceEntry);
financeRouter.get('/fetch', getAllEntry);
financeRouter.patch('/update', updateEntry);
financeRouter.delete('/delete', deleteEntry);

export default financeRouter;
