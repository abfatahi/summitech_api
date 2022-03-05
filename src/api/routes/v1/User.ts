import express from 'express';
import { body, header } from 'express-validator';
import { UserMiddleware } from '../../middlewares';
import Controller from '../../controllers/User';

const UserController = Controller();

const router = express.Router();

router.post(
  '/transfer',
  [
    header(
      'Authorization',
      'Unauthorized! Sign in to your account for authorization'
    )
      .exists()
      .bail()
      .custom((value: any) => UserMiddleware.isValidUserToken(value)),
    body('amount', 'Failed! Amount cannot be blank')
      .exists()
      .bail()
      .isNumeric()
      .withMessage('Failed! Fullname must be a numeric value')
      .trim(),
    body('beneficiary', 'Failed! Beneficairy cant be blank')
      .exists()
      .custom((beneficiary) => UserMiddleware.isUserExist(beneficiary)),
  ],
  UserController.funds_transfer
);

export default router;
