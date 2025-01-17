import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
const leisureSchema = new Schema(
    {
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ['emi', 'onepass', 'decreasing'],
            required: true,
        },
        boundVia: {
            type: String,
            enum: ['gold', 'land', 'other'],
            required: true,
        },
        NumberofEmi: {
            type: Number,
            required: true,
            min: 0,
            default: 1,
        },
        principle: {
            type: Number,
            required: true,
            min: 0,
        },
        amount: {
            //amount that has been paid till date
            type: Number,
            required: true,
            min: 0,
        },
        initialEMI: {
            //total emis paid till now
            type: Number,
            required: true,
            min: 1,
        },
        interest: {
            type: Number,
            required: true,
            min: 1,
        },
        status: {
            type: String,
            enum: ['paid', 'overdue', 'pending', 'closed'],
            default: 'pending',
            required: true,
        },
        lenderName: {
            type: String,
            required: true,
        },
        lenderContact: {
            type: String,
            required: true,
        },
        lenderEmail: {
            type: String,
        },
    },
    { timestamps: true }
);
leisureSchema.plugin(mongooseAggregatePaginate);
const leisure = mongoose.model('leisure', leisureSchema);
export default leisure;
