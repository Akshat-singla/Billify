import { Router } from 'express';
import {
    addleisure,
    getStatusLeisure,
    getboundLeisure,
    monthlyEmi,
    changeLeisureStatus,
    getAllleisure,
    closeleisure,
} from '../controllers/leisure.controllers.js';
const leisureRouter = Router();

leisureRouter.get('/', getAllleisure);
leisureRouter.get('/status', getStatusLeisure);
leisureRouter.get('/bound', getboundLeisure);
leisureRouter.post('/add', addleisure);
leisureRouter.patch('/monthly-emi', monthlyEmi);
leisureRouter.patch('/close', closeleisure);
leisureRouter.patch('/change-status', changeLeisureStatus);

export default leisureRouter;
