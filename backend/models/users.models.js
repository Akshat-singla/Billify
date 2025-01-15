import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema(
    {
        name: {
            type: String,
            reqiured: [true, 'Cannot create users without a name'],
        },
        email: {
            type: String,
            required: [true, 'email is needed'],
            unique: true,
        },
        phone: {
            type: String,
            required: [true, 'please pass a valid phone number'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'password not found'],
        },
        userType: {
            type: String,
            enum: ['admin', 'personal', 'enterprise'],
            required: true,
            default: 'personal',
        },
        isSubscribed: {
            type: Boolean,
            default: false,
        },
        SubscriptionTime: {
            type: Number,
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            isSubscribed: this.isSubscribed,
            userType: this.userType,
        },
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: process.env.JWT_TOKEN_EXPIRY }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: process.env.JWT_TOKEN_EXPIRY }
    );
};

const User = mongoose.model('user', userSchema);
export default User;
