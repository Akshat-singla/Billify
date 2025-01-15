import jwt from 'jsonwebtoken';
import User from '../models/users.models.js';
import { ApiError } from '../utils/index.js';

const verifyJWT = async (req, res, next) => {
    const token =
        req.cookies.accessToken ||
        req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json(ApiError(401, 'Unauthorized'));
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);

    const user = await User.findById(decodedToken?._id).select(
        '-password -refreshToken'
    );

    if (!user) return res.status(401).json(ApiError(401, 'Unauthorized'));

    req.user = user;

    next();
};

export default verifyJWT;
