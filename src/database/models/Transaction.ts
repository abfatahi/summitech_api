import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
    },
    beneficiary: {
      type: Number,
    },
    sender: {
      type: Number,
    },
    narration: {
      type: String,
    },
    type: {
      type: String,
    },
    depositReference: {
      type: String,
    },
    depositReferenceStatus: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const TransactionModel = mongoose.model('TransactionModel', TransactionSchema);

export default TransactionModel;
