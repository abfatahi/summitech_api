import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
    },
    beneficiary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
    },
    narration: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
);

const TransactionModel = mongoose.model('TransactionModel', TransactionSchema);

export default TransactionModel;
