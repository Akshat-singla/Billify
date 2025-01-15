/**
 add finance
 update finance
 delete finance
 */
import finance from '../models/finance.models.js';
import User from '../models/users.models.js';
import { ApiError, ApiResponse } from '../utils/index.js';

const addFinanceEntry = async (req, res) => {
    const { amount, title, paidTo } = req.body;
    const user = req.user._id;

    if (!amount)
        return res.status(401).json(new ApiError(401, 'Amount not entered'));
    if (!title)
        return res
            .status(401)
            .json(new ApiError(401, 'title should be entered'));

    if (!paidTo)
        return res.status(401).json(new ApiError(401, 'didnot get paid to'));

    try {
        const dbUser = await User.findById(user);

        if (!dbUser)
            return res
                .status(401)
                .json(new ApiError(401, 'database user not found'));

        //create a schema
        const data = {
            amount,
            title,
            paidTo,
            paidBy: dbUser._id,
        };
        const addedValue = await finance.create(data);
        if (!addedValue)
            return res
                .status(401)
                .json(new ApiError(401, "couldn't add finance"));

        return res
            .status(200)
            .json(new ApiResponse(200, 'Added value', addedValue));
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(
                new ApiError(500, 'somthing went wrong in adding the values', [
                    error,
                ])
            );
    }
};
const updateEntry = async (req, res) => {
    const user = req.user._id;
    const { id, amount } = req.body;
    if (!id) return res.status(401).json(new ApiError(401, 'id not found'));
    if (!amount)
        return res.status(401).json(new ApiError(401, 'amount not found'));

    try {
        const dbUser = await User.findById(user);
        if (!dbUser)
            return res
                .status(401)
                .json(new ApiError(401, 'no such user found in database'));
        const dbEntry = await finance.findById(id);
        if (!dbEntry)
            return res
                .status(401)
                .json(new ApiError(401, 'no such entry found'));

        const updatedinfo = await finance.findByIdAndUpdate(
            dbEntry._id,
            { $set: { amount } },
            { new: true }
        );
        if (!updatedinfo)
            return res
                .status(401)
                .json(new ApiError(401, 'error in updating the data'));

        return res
            .status(200)
            .json(
                new ApiResponse(200, 'data updated successfully', updatedinfo)
            );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiError(500, 'some error in entry updation', [error]));
    }
};
const deleteEntry = async (req, res) => {
    const user = req.user._id;
    const { id } = req.body;
    if (!id) return res.status(401).json(new ApiError(401, 'id not found'));

    try {
        const dbUser = await User.findById(user);
        if (!dbUser)
            return res
                .status(401)
                .json(new ApiError(401, 'no such user found in database'));
        const dbEntry = await finance.findById(id);
        if (!dbEntry)
            return res
                .status(401)
                .json(new ApiError(401, 'no such entry found'));

        const deletedInfo = await finance.findByIdAndDelete(dbEntry._id);
        if (!deletedInfo)
            return res
                .status(401)
                .json(new ApiError(401, 'error in updating the data'));

        return res
            .status(200)
            .json(
                new ApiResponse(200, 'data updated successfully', deletedInfo)
            );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(
                new ApiError(500, 'some error occured in data deletion', [
                    error,
                ])
            );
    }
};

const getAllEntry = async (req, res) => {
    const user = req.user._id;
    if (!user)
        return res.status(401).json(new ApiError(401, 'user is required'));

    const dbUser = await User.findById(user);
    if (!dbUser)
        return res
            .status(401)
            .json(new ApiError(401, 'database user not found'));

    try {
        const userRecord = await finance.aggregate([
            {
                $match: {
                    paidBy: dbUser._id,
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 },
                    records: { $push: '$$ROOT' },
                },
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 },
            },
        ]);

        if (!userRecord)
            return res
                .status(401)
                .json(new ApiError(401, 'error in aggregation pipelining'));

        return res
            .status(200)
            .json(
                new ApiResponse(200, 'data fetched Successfully', userRecord)
            );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiError(500, 'error in fetching data', [error]));
    }
};

export { addFinanceEntry, updateEntry, deleteEntry, getAllEntry };
