import User from '../models/users.models.js';
import leisure from '../models/leisure.models.js';
import finance from '../models/finance.models.js';
import { ApiError, ApiResponse } from '../utils/index.js';
const getUserById = async (req, res) => {
    const { searchBasis } = req.body;
    if (!searchBasis)
        return res
            .status(401)
            .json(new ApiError(401, 'need a search parameter to enter'));
    try {
        const dbUser = await User.find({
            $or: [
                { email: searchBasis },
                { name: searchBasis },
                { phone: searchBasis },
            ],
        }).select('-password -refreshToken');

        if (!dbUser)
            return res.status(401).json(new ApiError(401, 'no user found'));

        return res
            .status(200)
            .json(new ApiResponse(200, 'user data retrieved', dbUser));
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiError(500, 'error in getting user', [error]));
    }
};
const getUserLeisures = async (req, res) => {
    const { searchBasis } = req.body;
    if (!searchBasis)
        return res
            .status(401)
            .json(new ApiError(401, 'need a search parameter to enter'));
    try {
        const dbUser = await User.find({
            $or: [
                { email: searchBasis },
                { name: searchBasis },
                { phone: searchBasis },
            ],
        }).select('-password -refreshToken');

        if (!dbUser)
            return res.status(401).json(new ApiError(401, 'no user found'));

        const Userleisure = await leisure.find({
            provider: dbUser._id,
        });

        if (!Userleisure)
            return res
                .status(401)
                .json(new ApiError(401, 'user leisure not found'));

        return res
            .status(200)
            .json(
                new ApiResponse(200, 'user leisure data retrieved', Userleisure)
            );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiError(500, 'error in getting user leisure', [error]));
    }
};
const getUserfinances = async (req, res) => {
    const { searchBasis } = req.body;
    if (!searchBasis)
        return res
            .status(401)
            .json(new ApiError(401, 'need a search parameter to enter'));
    try {
        const dbUser = await User.find({
            $or: [
                { email: searchBasis },
                { name: searchBasis },
                { phone: searchBasis },
            ],
        }).select('-password -refreshToken');

        if (!dbUser)
            return res.status(401).json(new ApiError(401, 'no user found'));

        const Userfinance = await finance.find({
            paidBy: dbUser._id,
        });

        if (!Userfinance)
            return res
                .status(401)
                .json(new ApiError(401, 'user leisure not found'));

        return res
            .status(200)
            .json(
                new ApiResponse(200, 'user finance data retrieved', Userfinance)
            );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiError(500, 'error in getting user finance', [error]));
    }
};
const cancleSubscription = async (req, res) => {
    const { searchBasis } = req.body;
    if (!searchBasis)
        return res
            .status(401)
            .json(new ApiError(401, 'need a search basis of User'));
    try {
        const dbUser = await User.find({
            $or: [
                { email: searchBasis },
                { phone: searchBasis },
                { name: searchBasis },
            ],
        });
        if (!dbUser)
            return res
                .status(401)
                .json(new ApiError(401, 'cannot find the user in database'));

        const updatedUser = await User.findByIdAndUpdate(
            dbUser._id,
            {
                $set: { isSubscribed: false },
            },
            { new: true }
        );

        if (!updatedUser)
            return res
                .status(401)
                .json(new ApiError(401, "couldn't update the user"));

        return res
            .status(401)
            .json(
                new ApiResponse(401, 'user updated successfully', updatedUser)
            );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(
                new ApiError(500, 'error in canceling subscription', [error])
            );
    }
};
const cancelUser = async (req, res) => {
    const { searchBasis } = req.body;
    if (!searchBasis)
        return res
            .status(401)
            .json(new ApiError(401, 'need a search parameter to enter'));
    try {
        const dbUser = await User.find({
            $or: [
                { email: searchBasis },
                { name: searchBasis },
                { phone: searchBasis },
            ],
        }).select('-password -refreshToken');

        if (!dbUser)
            return res.status(401).json(new ApiError(401, 'no user found'));

        const deletedUser = await User.findByIdAndDelete(dbUser._id);

        if (!deletedUser)
            return res.status(401).json(401, 'user couldnot be deleted');

        return res
            .status(200)
            .json(new ApiResponse(200, 'user has been canceled', deletedUser));
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiError(500, 'error in getting user finance', [error]));
    }
};

export {
    getUserById,
    getUserLeisures,
    getUserfinances,
    cancelUser,
    cancleSubscription,
};
