import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { TransactionModel, UserModel } from '../../database/models';

export default () => {
  const funds_transfer = async (req: any, res: any) => {
    try {
      // Error Validation
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      //Destructure Body
      const { amount, beneficiary, narration } = req.body;

      const tokenData = jwt.verify(
        req.headers.authorization.split(' ')[1],
        `${process.env.JWT_SECRET}`
      );

      const User = await UserModel.findOne({
        email: (tokenData as TokenData).email,
      });

      // Check for self transfer
      if (User._id === beneficiary)
        return res
          .status(400)
          .json({ message: 'You cannot transfer to yourself' });

      // Check for sufficient funds
      if (parseFloat(amount) > parseFloat(User.wallet_balance))
        return res.status(400).json({ message: 'Insufficient Funds!' });

      // Check minimum transaction amount
      if (parseFloat(amount) < 100)
        return res
          .status(400)
          .json({ message: 'Minimum transfer amount is #100' });

      //Debit sender account
      const newUserBalance =
        parseFloat(User.wallet_balance) - parseFloat(amount);
      User.wallet_balance = newUserBalance;
      User.save();

      //Credit beneficiary account
      const Beneficiary = await UserModel.findOne({ _id: beneficiary });
      console.log(Beneficiary);
      const newBeneficiaryBalance =
        parseFloat(Beneficiary.wallet_balance) + parseFloat(amount);
      Beneficiary.wallet_balance = newBeneficiaryBalance;
      Beneficiary.save();

      //Create new transaction
      const newTransaction = new TransactionModel({
        amount,
        beneficiary,
        sender: User._id,
        narration,
        type: 'Transfer',
      });

      newTransaction.save();

      return res.status(200).json({
        message: 'success',
        data: { newTransaction },
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  return { funds_transfer };
};

interface TokenData {
  email: string;
}
