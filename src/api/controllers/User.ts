import jwt from 'jsonwebtoken';
import axios from 'axios';
import { validationResult } from 'express-validator';
import { TransactionModel, UserModel } from '../../database/models';

export default () => {
  const fund_wallet = async (req: any, res: any) => {
    try {
      // Error Validation
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      //Destructure Body
      const { amount, email } = req.body;
      const newAmount = parseFloat(amount) * 100;
      const initializeFundWallet = await axios.post(
        `https://api.paystack.co/transaction/initialize`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
          },
          body: JSON.stringify(newAmount, email),
        }
      );
      const { status, data, message } = initializeFundWallet.data;
      if (status === false) {
        return res.status(400).json({ message });
      }
      if (status === true) {
        return res.status(200).json({
          message: 'success',
          data,
        });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const verify_fund_wallet = async (req: any, res: any) => {
    try {
      // Error Validation
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      //Extract Email from JWT Token
      const tokenData = jwt.verify(
        req.headers.authorization.split(' ')[1],
        `${process.env.JWT_SECRET}`
      );

      //Find Vendor and Vendor Transaction
      const User = await UserModel.findOne({
        email: (tokenData as TokenData).email,
      });

      //Destructure Body
      const verifyPayment = await axios.get(
        `https://api.paystack.co/transaction/verify/${req.params.reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
          },
        }
      );
      const { amount, gateway_response } = verifyPayment.data.data;

      if (gateway_response !== 'Successful') {
        res.status(422).json({ message: 'Something went wrong' });
      }

      if (gateway_response === 'Successful') {
        const newUserBalance = parseFloat(User.wallet_balance) + amount;
        User.wallet_balance = newUserBalance;
        User.save();

        return res.status(201).json({
          message: 'Deposit Successful!',
        });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

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

      const Beneficiary = await UserModel.findOne({ _id: beneficiary });

      // Check for self transfer
      if (User.email === Beneficiary.email)
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

  return { fund_wallet, funds_transfer, verify_fund_wallet };
};

interface TokenData {
  email: string;
}

interface PaystackResponse {
  message: string;
}
