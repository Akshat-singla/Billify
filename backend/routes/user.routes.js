import { Router } from 'express';
import {
    UserRegistration,
    Userlogin,
    Userlogout,
    changePassword,
} from '../controllers/user.controllers.js';
import verifyJWT from '../middlewares/auth.middlewares.js';
const userRouter = Router();

userRouter.post('/login', Userlogin);
userRouter.post('/register', UserRegistration);
userRouter.post('/change-password', verifyJWT, changePassword);
userRouter.post('/logout', verifyJWT, Userlogout);

export default userRouter;
