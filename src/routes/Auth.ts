import express from 'express';
import { body } from 'express-validator';
import { UserMiddleware } from '../middlewares';
import Controller from '../controllers/Auth';

const UserController = Controller();

const router = express.Router();

router.post(
  '/register',
  [
    body('fullname', 'Failed! Fullname cannot be blank')
      .exists()
      .bail()
      .isString()
      .withMessage('Failed! Fullname must be a string')
      .trim()
      .isLength({ min: 10, max: 25 })
      .withMessage('Fullname should have 10 to 25 characters'),
    body('email', 'Failed! Email cant be blank')
      .exists()
      .isEmail()
      .withMessage('Invalid Email format')
      .custom((email) => UserMiddleware.isUniqueEmail(email)),
    body('password', 'Failed! Password cannot be blank')
      .exists()
      .isLength({ min: 8 })
      .withMessage('Password must be 8 characters or more'),
    body('pin', 'Failed! Authentication pin cannot be blank')
      .exists()
      .bail()
      .trim()
      .isLength({ min: 8, max: 8 })
      .withMessage('Code should have 8 characters')
      .isInt({ allow_leading_zeroes: true })
      .withMessage('Code must be an integer of 8 digits'),
    body('phone_number', 'Failed! Phone Number cannot be blank')
      .exists()
      .bail()
      .trim()
      .isLength({ min: 10, max: 15 })
      .withMessage('Phone number should have 10 to 15 characters'),
  ],
  UserController.register
);

export default router;
