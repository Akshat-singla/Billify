import { Router } from 'express';
import {
    cancelUser,
    cancleSubscription,
    getUserById,
    getUserfinances,
    getUserLeisures,
} from '../controllers/admin.controllers';

const adminRouter = Router();

adminRouter.get('/user', getUserById);
adminRouter.get('/leisure', getUserLeisures);
adminRouter.get('/finances', getUserfinances);
adminRouter.delete('/remove', cancelUser);
adminRouter.patch('/cancel', cancleSubscription);

export default adminRouter;
