import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
const financeSchema = new Schema(
    {
        amount: {
            type: Number,
            required: true,
            min: 9,
        },
        title: {
            type: String,
            required: [true, 'this is needed for better management'],
        },
        paidTo: {
            type: String,
            required: true,
        },
        paidBy: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
    },
    { timestamps: true }
);
financeSchema.plugin(mongooseAggregatePaginate);

const finance = mongoose.model('finance', financeSchema);
export default finance;
