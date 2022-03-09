import express from 'express';
import { body, header, param } from 'express-validator';
import { UserMiddleware } from '../../middlewares';
import Controller from '../../controllers/User';

const UserController = Controller();

const router = express.Router();

router.post(
  '/fund-wallet',
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
    body(
      'account_number',
      'Failed! Beneficairy account number must cant be blank'
    )
      .exists()
      .isNumeric()
      .withMessage(
        'Failed!  Beneficairy account number must be a numeric value'
      )
      .isLength({ min: 10, max: 10 })
      .withMessage(
        'Failed!  Beneficairy account number must be a valid 10 digit number'
      )
      .custom((account_number) => UserMiddleware.isUserExist(account_number)),
  ],
  UserController.funds_transfer
);

router.get(
  '/fund-wallet/verify/:reference',
  [
    header(
      'Authorization',
      'Unauthorized! Sign in to your account for authorization'
    )
      .exists()
      .bail()
      .custom((value: any) => UserMiddleware.isValidUserToken(value)),
    param('reference', 'Failed! Reference cannot be blank').exists().bail(),
  ],
  UserController.verify_fund_wallet
);

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
      .withMessage('Failed! Amount must be a numeric value')
      .trim(),
    body(
      'account_number',
      'Failed! Beneficairy account number must cant be blank'
    )
      .exists()
      .isNumeric()
      .withMessage(
        'Failed!  Beneficairy account number must be a numeric value'
      )
      .isLength({ min: 10, max: 10 })
      .withMessage(
        'Failed!  Beneficairy account number must be a valid 10 digit number'
      )
      .custom((account_number) => UserMiddleware.isUserExist(account_number)),
  ],
  UserController.funds_transfer
);

export default router;
