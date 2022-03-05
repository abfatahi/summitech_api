import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ValidationError, validationResult } from 'express-validator';
import { UserModel } from '../database/models';
import { Request } from 'express-validator/src/base';

export default () => {
  const register = async (req: Request, res: any) => {
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
        User: { fullname, email, phone_number },
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  return { register };
};
