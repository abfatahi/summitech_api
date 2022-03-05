import { UserModel } from '../../database/models/index';
import jwt from 'jsonwebtoken';

const isUniqueEmail = async (email: any) => {
  const emailExist = await UserModel.findOne({ email });
  if (emailExist) throw new Error('Failed! Email already in use');

  return true;
};

const isEmailExist = async (email: any) => {
  const emailExist = await UserModel.findOne({ email });
  if (!emailExist) throw new Error('Failed! User account does not exist');

  return true;
};

const isUserExist = async (_id: any) => {
  const userExist = await UserModel.findOne({ _id });
  if (!userExist) throw new Error('Failed! User account does not exist');

  return true;
};

const isValidUserToken = async (value: string) => {
  const token = value.split(' ')[1];
  const tokenData = jwt.verify(token, `${process.env.JWT_SECRET}`);
  if (!tokenData) throw new Error(tokenData);

  interface TokenData {
    email: string;
  }
  const isUser = await UserModel.findOne({
    where: { email: (tokenData as TokenData).email },
  });
  if (!isUser) throw new Error('Unauthorized!');

  return true;
};

export default {
  isUniqueEmail,
  isEmailExist,
  isValidUserToken,
  isUserExist
};
