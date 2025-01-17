import { ApiError, ApiResponse } from '../utils/index.js';
import User from '../models/users.models.js';
import leisure from '../models/leisure.models.js';

const addleisure = async (req, res) => {
    const user = req.user._id;
    const {
        paymentMethod,
        boundVia,
        NumberofEmi,
        amount,
        interest,
        lenderName,
        lenderContact,
        lenderEmail,
    } = req.body;
    if (!user)
        return res.status(401).json(new ApiError(401, 'user id not found'));
    if (!paymentMethod)
        return res
            .status(401)
            .json(new ApiError(401, 'paymentMethod is not found'));
    if (!boundVia)
        return res.status(401).json(new ApiError(401, 'boundVia is not found'));
    if (!NumberofEmi)
        return res
            .status(401)
            .json(new ApiError(401, 'NumberofEmi is not found'));
    if (!amount)
        return res.status(401).json(new ApiError(401, 'amount is not found'));
    if (!interest)
        return res.status(401).json(new ApiError(401, 'interest is not found'));
    if (!lenderName)
        return res
            .status(401)
            .json(new ApiError(401, 'lenderName is not found'));
    if (!lenderContact)
        return res
            .status(401)
            .json(new ApiError(401, 'lenderContact is not found'));

    try {
        const dbUser = await User.findById(user);
        if (!dbUser)
            return res
                .status(401)
                .json(new ApiError(401, 'missing user in database'));

        const createdLeisure = await leisure.create({
            provider: dbUser._id,
            paymentMethod,
            boundVia,
            NumberofEmi,
            amount: 0,
            interest,
            principle: amount,
            initialEMI: NumberofEmi,
            status: 'pending',
            lenderName,
            lenderContact,
            lenderEmail,
        });

        if (!createdLeisure)
            return res
                .status(401)
                .json(new ApiError(401, 'user not created in database'));

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    'leisure creation is successful',
                    createdLeisure
                )
            );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(
                new ApiError(500, 'some error occured in adding user', [error])
            );
    }
};
const getAllleisure = async (req, res) => {
    const { status } = req.body;
    const user = req.user._id;

    if (!user)
        return res
            .status(401)
            .json(new ApiError(401, 'user not found in database'));

    try {
        const leisuredata = await leisure.find({
            provider: user,
            status: { $in: ['paid', 'overdue', 'pending'] },
        });

        if (!leisuredata)
            return res
                .status(401)
                .json(new ApiError(401, "couldn't fetch the data"));

        return res
            .status(200)
            .json(
                new ApiResponse(200, 'data fetched successfully', leisuredata)
            );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiError(500, "couldn't get the status", [error]));
    }
};
const getStatusLeisure = async (req, res) => {
    const { status } = req.body;
    const user = req.user._id;

    if (!user)
        return res
            .status(401)
            .json(new ApiError(401, 'user not found in database'));

    try {
        const leisuredata = await leisure.aggregate([
            {
                $match: { provider: user, status },
            },
            {
                $sort: { createdAt: 1 },
            },
        ]);

        if (!leisuredata)
            return res
                .status(401)
                .json(new ApiError(401, "couldn't fetch the data"));

        return res
            .status(200)
            .json(
                new ApiResponse(200, 'data fetched successfully', leisuredata)
            );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiError(500, "couldn't get the status", [error]));
    }
};
const getboundLeisure = async (req, res) => {
    const { boundVia } = req.body;
    const user = req.user._id;

    if (!user)
        return res
            .status(401)
            .json(new ApiError(401, 'user not found in database'));
    if (!boundVia)
        return res.status(401).json(new ApiError(401, 'need the bound way'));
    try {
        const leisuredata = await leisure.aggregate([
            {
                $match: { provider: user, boundVia },
            },
            {
                $sort: { createdAt: 1 },
            },
        ]);

        if (!leisuredata)
            return res
                .status(401)
                .json(new ApiError(401, "couldn't fetch the data"));

        return res
            .status(200)
            .json(
                new ApiResponse(200, 'data fetched successfully', leisuredata)
            );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiError(500, "couldn't get the status", [error]));
    }
};
const closeleisure = async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(401).json(new ApiError(401, 'id not found'));

    try {
        const dbEntry = await leisure.findById(id);
        if (!dbEntry)
            return res
                .status(401)
                .json(new ApiError(401, 'couldnot find the leisure entry'));

        const updatedEntry = await leisure.findByIdAndUpdate(
            dbEntry._id,
            {
                $set: { status: 'closed', NumberofEmi: 0 },
            },
            { new: true }
        );
        if (!updatedEntry)
            return res
                .status(401)
                .json(new ApiError(401, 'couldnot update the user entry'));

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    'leisure closed successfully',
                    updatedEntry
                )
            );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiError(500, "couldn't close leisure", [error]));
    }
};
const changeLeisureStatus = async (req, res) => {
    const { id, updatedStatus } = req.body;
    if (!id) return res.status(401).json(new ApiError(401, 'id not found'));

    if (!updatedStatus)
        return res
            .status(401)
            .json(new ApiError(401, 'updatedStatus is required'));
    try {
        const dbEntry = await leisure.findById(id);
        if (!dbEntry)
            return res
                .status(401)
                .json(new ApiError(401, 'couldnot find the leisure entry'));

        if (dbEntry.status === updatedStatus)
            return res
                .status(200)
                .json(
                    new ApiResponse(200, 'un-needed database updation', dbEntry)
                );

        const updatedEntry = await leisure.findByIdAndUpdate(
            dbEntry._id,
            {
                $set: { status: updatedStatus },
            },
            { new: true }
        );
        if (!updatedEntry)
            return res
                .status(401)
                .json(new ApiError(401, 'couldnot update the user entry'));

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    'leisure closed successfully',
                    updatedEntry
                )
            );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiError(500, "couldn't close leisure", [error]));
    }
};
const monthlyEmi = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res
            .status(401)
            .json(new ApiError(401, 'ID is required for EMI calculation'));
    }

    try {
        const dbleisure = await leisure.findById(id);

        if (!dbleisure) {
            return res
                .status(404)
                .json(new ApiError(404, 'Leisure record not found'));
        }

        if (dbleisure.status === 'closed')
            return res
                .status(401)
                .json(
                    new ApiError(
                        401,
                        'leisure is already closed cant make any changes'
                    )
                );

        const monthlyInterestRate = dbleisure.interest / 100 / 12;
        let updatedAmount = dbleisure.amount;
        let emiAmount = 0;
        switch (dbleisure.paymentMethod) {
            case 'emi':
                // Calculate fixed EMI using the formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
                emiAmount =
                    (dbleisure.principle *
                        monthlyInterestRate *
                        Math.pow(
                            1 + monthlyInterestRate,
                            dbleisure.NumberofEmi
                        )) /
                    (Math.pow(1 + monthlyInterestRate, dbleisure.NumberofEmi) -
                        1);
                updatedAmount += emiAmount;
                break;

            case 'decreasing':
                // Calculate reducing balance EMI
                const principalComponent =
                    dbleisure.principle / dbleisure.NumberofEmi;
                const interestComponent =
                    (dbleisure.principle - dbleisure.amount) *
                    monthlyInterestRate;

                emiAmount = principalComponent + interestComponent;
                updatedAmount += emiAmount;
                break;

            case 'onepass':
                emiAmount =
                    dbleisure.principle *
                    monthlyInterestRate *
                    dbleisure.NumberofEmi;
                updatedAmount = dbleisure.principle + emiAmount;
                break;

            default:
                return res
                    .status(400)
                    .json(new ApiError(400, 'Invalid payment method'));
        }
        let updatedUser = await leisure.findByIdAndUpdate(
            dbleisure._id,
            {
                $set: {
                    amount: updatedAmount,
                    initialEMI: dbleisure.initialEMI - 1,
                    status: 'paid',
                },
            },
            { new: true }
        );

        if (!updatedUser)
            return res
                .status(401)
                .json(new ApiError(401, 'couldnot update the leisure'));

        if (updatedUser.initialEMI === 0)
            updatedUser = await leisure.findByIdAndUpdate(
                dbleisure._id,
                {
                    $set: { status: 'closed' },
                },
                { new: true }
            );

        return res.status(200).json(
            new ApiResponse(200, 'monthly emi paid successfully', {
                updatedUser,
            })
        );
    } catch (error) {
        console.error('EMI calculation error:', error);
        return res
            .status(500)
            .json(new ApiError(500, 'Error calculating EMI', [error]));
    }
};

export {
    addleisure,
    getStatusLeisure,
    getboundLeisure,
    monthlyEmi,
    changeLeisureStatus,
    getAllleisure,
    closeleisure,
};
