import express from 'express';
import authController from '../../controllers/auth-controller.js';
import { authenticate, upload, isEmptyBody } from '../../middlewares/index.js';
import { validateBody } from '../../decorators/index.js';
import {
  userSignupSchema,
  userSigninSchema,
  userEmailValidateSchema,
} from '../../models/User.js';

const userSignupValidate = validateBody(userSignupSchema); // JOI midleware
const userSigninValidate = validateBody(userSigninSchema); // JOI midleware
const userEmailValidate = validateBody(userEmailValidateSchema); // JOI midleware

const authRouter = express.Router();

authRouter.post(
  '/users/register',
  isEmptyBody,
  userSignupValidate,
  authController.signup
);

authRouter.get('/users/verify/:verificationToken', authController.verify);

authRouter.post(
  '/users/verify',
  isEmptyBody,
  userEmailValidate,
  authController.resendVerify
);

authRouter.post(
  '/users/login',
  isEmptyBody,
  userSigninValidate,
  authController.signin
);

authRouter.patch(
  '/users/avatars',
  authenticate,
  upload.single('avatarURL'),
  authController.createAvatar
);

authRouter.get('/users/current', authenticate, authController.getCurrent);

authRouter.post('/users/logout', authenticate, authController.logout);

export default authRouter;
