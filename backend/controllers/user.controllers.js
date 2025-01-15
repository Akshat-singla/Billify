/*
 user login
 user registration
 change password
 subscription
 logout
 */
import { ApiError, ApiResponse } from '../utils/index.js';
import User from '../models/users.models.js';

const generateAccessAndRefreshToken = async (id) => {
    const user = await User.findById(id);

    if (!user)
        res.status(403).json(
            new ApiError(403, 'user not found to generate Access Token')
        );

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return { accessToken, refreshToken };
};
const UserRegistration = async (req, res) => {
    const { name, email, password, phone, userType } = req.body;
    if (!name)
        res.status(402).json(new ApiError(402, 'User not found', 'Error'));
    if (!email)
        res.status(402).json(new ApiError(402, 'Email Not found', 'Error'));
    if (!password)
        res.status(402).json(
            new ApiError(402, 'Password is required', 'Error')
        );
    if (!phone)
        res.status(402).json(new ApiError(402, 'Phone not Found', 'Error'));
    if (!userType) {
        userType = 'personal';
    }

    try {
        const createdUser = await User.create({
            name,
            email,
            password,
            phone,
            userType,
            isSubscribed: false,
            financeBook: [],
            leisureBook: [],
        });

        if (!createdUser)
            res.status(400).json(
                new ApiError(400, 'User not registered in database')
            );

        const dbUser = await User.findById(createdUser._id).select(
            '-password -refreshToken '
        );

        if (!dbUser)
            res.status(400).json(
                new ApiError(400, 'user not found in database')
            );
        return res.status(200).json(new ApiResponse(200, 'Status OK', dbUser));
    } catch (error) {
        res.status(403).json(
            new ApiError(403, 'Error in user Creation', [error])
        );
    }
};
const changePassword = async (req, res) => {
    const user = req.user._id;
    if (!user)
        return res
            .status(401)
            .json(new ApiError(401, 'no cookie data recieved'));

    const { password } = req.body;
    if (!user)
        return res.status(401).json(new ApiError(401, 'password not recieved'));

    const dbUser = await User.findById(user);
    if (!dbUser)
        return res.status(401).json(new ApiError(401, 'no user in database'));

    dbUser.password = password;

    await dbUser.save();

    const updatedUser = await User.findById(user).select(
        '-password -refreshToken'
    );
    if (!updatedUser)
        return res
            .status(500)
            .json(new ApiError(500, 'couldnot update the password'));

    return res
        .status(200)
        .json(
            new ApiResponse(200, 'password changed successfully', updatedUser)
        );
};
const Userlogin = async (req, res) => {
    const { email, phone, password } = req.body;
    if (!email) res.status(403).json(new ApiError(403, 'email not found'));
    if (!phone) res.status(403).json(new ApiError(403, 'phone not found'));
    if (!password)
        res.status(403).json(new ApiError(403, 'password not found'));

    try {
        const foundUser = await User.findOne({
            $or: [{ email }, { phone }],
        });

        if (!foundUser)
            res.status(403).json(
                new ApiError(403, 'user not found in database')
            );

        const passwordValidation = await foundUser.isPasswordCorrect(password);
        if (!passwordValidation) {
            res.status(401).json(new ApiError(401, 'password is not correct'));
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(foundUser._id);

        const updatedUser = await User.findByIdAndUpdate(
            foundUser._id,
            { $set: { refreshToken: refreshToken } },
            { new: true, runValidators: false }
        ).select('-password');

        if (!updatedUser)
            res.status(403).json(
                new ApiError(403, 'unable to update the user')
            );

        return res
            .status(200)
            .cookie('accessToken', accessToken)
            .cookie('refreshToken', refreshToken)
            .json(
                new ApiResponse(200, 'Status OK', {
                    accessToken,
                    userData: updatedUser,
                })
            );
    } catch (error) {
        console.log(error);

        res.status(403).json(new ApiError(403, 'Error in user login', [error]));
    }
};
const Userlogout = async (req, res) => {
    try {
        const loggedoutUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { refreshToken: undefined } },
            { new: true }
        ).select('-password');

        if (!loggedoutUser)
            return res
                .status(500)
                .json(new ApiError(500, 'didnot logged out '));

        return res
            .status(200)
            .clearCookie('accessToken')
            .clearCookie('refreshToken')
            .json(new ApiResponse(200, 'user logged out', loggedoutUser));
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, 'error occured in logging out', [error]));
    }
};
export { UserRegistration, Userlogin, Userlogout, changePassword };
