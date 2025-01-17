import Razorpay from 'razorpay';
import { ApiError, ApiResponse } from '../utils/index.js';
import User from '../models/users.models.js';
import crypto from 'crypto';
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorPay = async (req, res) => {
    const { id, name, email } = req.body;
    if (!id)
        return res.status(401).json(new ApiError(401, 'user id is required'));
    if (!email || !name)
        return res
            .status(401)
            .json(new ApiError(401, 'email and name is required'));

    try {
        const dbUser = await User.findById(id);
        if (!dbUser)
            return res
                .status(401)
                .json(
                    new ApiError(401, 'no database entry of such user found')
                );

        const options = {
            amount: 120 * 100,
            currency: 'INR',
            receipt: `premium_${id}_${new Date.now().toISOString()}`,
        };

        const order = await razorpay.orders.create(options);
        if (!order)
            return res.status(401).json(401, 'order was not found', order);

        const updatedUser = await User.findByIdAndUpdate(
            dbUser._id,
            {
                $set: {
                    isSubscribed: true,
                    SubscriptionTime: 36000 * 24 * 30,
                },
            },
            { new: true }
        ).select('-password -refreshToken');
        if (!updatedUser)
            return res.status(401).json(new ApiError(401, 'user updated'));

        return res
            .status(200)
            .json(new ApiResponse(200, 'order has been created', updatedUser));
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(
                new ApiResponse(500, 'error in razorpay logic creation', [
                    error,
                ])
            );
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            req.body;

        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthenticated = expectedSignature === razorpay_signature;

        if (!isAuthenticated)
            return res
                .status(401)
                .json(new ApiError(401, 'payment is not authenticated'));

        return res.status(200).json(
            new ApiResponse(200, 'payment is successful', {
                isAuthenticated,
                razorpay_order_id,
                razorpay_payment_id,
            })
        );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(
                new ApiError(
                    500,
                    'payment is not authenticaed or some error occured',
                    [error]
                )
            );
    }
};

export { createRazorPay, verifyPayment };
