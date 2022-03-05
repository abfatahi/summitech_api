import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { UserModel } from '../../database/models';

export default () => {
  const register = async (req: any, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      //Hash Password
      const password = await bcrypt.hash(
        req.body.password,
        bcrypt.genSaltSync(10)
      );

      //convert Email to lowercase
      const email = req.body.email.toLowerCase();

      const { fullname, pin, phone_number } = req.body;

      const new_user = new UserModel({
        fullname,
        email,
        password,
        phone_number,
        pin,
      });

      new_user.save();

      return res.status(200).json({
        message: 'success',
        data: { fullname, email, phone_number },
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const login = async (req: any, res: any) => {
    try {
      // Error Validation
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      // Authentication Logic
      const { email, password } = req.body;
      const User = await UserModel.findOne({ email });
      if (!User)
        return res
          .status(400)
          .json({ errors: [{ message: 'Failed! Invalid login details' }] });

      // compare password
      const isValidPassword = await bcrypt.compare(password, User.password);
      if (!isValidPassword)
        return res
          .status(400)
          .json({ errors: [{ message: 'Failed! Incorrect password' }] });

      // Generate customer token
      const token = jwt.sign(
        { email: User.email },
        `${process.env.JWT_SECRET}`,
        {
          expiresIn: '10d',
        }
      );

      return res.status(200).json({
        message: 'success',
        data: {
          fullname: User.fullname,
          email,
          phone_number: User.phone_number,
          wallet_balance: User.wallet_balance,
          role: User.role,
          is_active: User.is_active,
        },
        token,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  return { register, login };
};
