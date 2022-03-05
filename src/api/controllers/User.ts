import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { UserModel } from '../../database/models';

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

      // Check for sufficient funds
      if (parseFloat(amount) > parseFloat(User.wallet_balance))
        return res.status(400).json({ message: 'Insufficient Funds!' });

      const Beneficiary = await UserModel.findOne({});
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  return funds_transfer;
};

interface TokenData {
  email: string;
}
