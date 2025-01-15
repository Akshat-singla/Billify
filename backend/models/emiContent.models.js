import mongoose, { Schema } from 'mongoose';

const emiSchema = new Schema(
    {
        NumberOfEMI: {
            type: Number,
            required: true,
            min: 1,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        interest: {
            type: Number,
            required: true,
            min: 0,
        },
        MonthlyEMI: {
            type: Number,
            required: true,
            min: 0,
        },
        finalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        interestPaid: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        TotalPaid: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        status: {
            type: String,
            enum: [
                'paid',
                'monthlyPaid',
                'monthlyUnpaid',
                'pending',
                'overdue',
                'closed',
            ],
            required: true,
            default: 'pending',
        },
        overdueAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        payments: [
            {
                date: { type: Date, required: true },
                amountPaid: { type: Number, required: true, min: 0 },
                status: {
                    type: String,
                    enum: ['on-time', 'late'],
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

export default EMIModel = mongoose.model('emi', emiSchema);
