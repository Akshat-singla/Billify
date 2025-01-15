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
            amount,
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
                $set: { status: 'closed', amount: 0, NumberofEmi: 0 },
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
    if (!id)
        return res
            .status(401)
            .json(new ApiError(401, 'id missing for EMI updation'));

    try {
        const dbleisure = await leisure.findById(id);
        if (!dbleisure)
            return res
                .status(401)
                .json(new ApiError(401, 'no EMI found in database'));

        let updatedAmount = dbleisure.amount;
        let updatedNumberofEmi = dbleisure.NumberofEmi - 1;
        const paymentType = dbleisure.paymentMethod;
        let emiCost = 0;

        const principal = dbleisure.principle;
        const initialEMI = dbleisure.initialEMI;
        const interestRate = dbleisure.interest / 100;
        const numberOfInstallments = dbleisure.NumberofEmi;

        if (paymentType === 'emi') {
            const monthlyInterestRate = interestRate / 12;

            emiCost =
                (principal *
                    monthlyInterestRate *
                    Math.pow(1 + monthlyInterestRate, numberOfInstallments)) /
                (Math.pow(1 + monthlyInterestRate, numberOfInstallments) - 1);
        } else if (paymentType === 'decreasing') {
            const monthlyInterestRate = interestRate / 12;

            const interestValue = updatedAmount * monthlyInterestRate;
            emiCost = updatedAmount / numberOfInstallments + interestValue;

            updatedAmount -= emiCost - interestValue;
        } else if (paymentType === 'onepass') {
            updatedAmount = 0;
            updatedNumberofEmi = 0;
        } else {
            return res
                .status(400)
                .json(new ApiError(400, 'Invalid payment method'));
        }

        const updatedStatus =
            updatedNumberofEmi <= 0 || updatedAmount <= 0 ? 'closed' : 'paid';

        const updatedEntry = await leisure.findByIdAndUpdate(dbleisure._id, {
            $set: {
                amount: updatedAmount,
                status: updatedStatus,
                NumberofEmi: updatedNumberofEmi,
                initialEMI: emiCost,
            },
        });

        if (!updatedEntry)
            return res
                .status(401)
                .json(new ApiError(401, 'Error occurred in updating entry'));

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    'Monthly EMI paid successfully',
                    updatedEntry
                )
            );
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json(
                new ApiError(500, "Couldn't update the monthly EMI", [error])
            );
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
