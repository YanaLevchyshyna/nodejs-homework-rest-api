import express from 'express';
import authController from '../../controllers/auth-controller.js';
import { authenticate, isEmptyBody } from '../../middlewares/index.js';
import { validateBody } from '../../decorators/index.js';
import { userSignupSchema, userSigninSchema } from '../../models/User.js';

const userSignupValidate = validateBody(userSignupSchema); // JOI midleware
const userSigninValidate = validateBody(userSigninSchema); // JOI midleware

const authRouter = express.Router();

authRouter.post(
  '/users/register',
  isEmptyBody,
  userSignupValidate,
  authController.signup
);

authRouter.post(
  '/users/login',
  isEmptyBody,
  userSigninValidate,
  authController.signin
);

authRouter.get('/users/current', authenticate, authController.getCurrent);

authRouter.post('/users/logout', authenticate, authController.logout);

export default authRouter;
