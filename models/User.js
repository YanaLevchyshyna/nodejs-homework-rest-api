import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleSaveError, runValidatorsAtUpdate } from '../models/hooks.js';

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, 'Set password for user'],
    },
    token: {
      type: String,
    },
    avatarURL: {
      type: String,
    },

    verify: {
      // поле verify вказує чи підтверджений емейл чи ні
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  },
  { versionKey: false }
);

userSchema.post('save', handleSaveError); // якщо при збереженні нового контакту буде помилка,
// то помилка буде викинута хуком handleSaveError.

userSchema.pre('findOneAndUpdate', runValidatorsAtUpdate);

export const userSignupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const userEmailValidateSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const User = model('user', userSchema);

export default User;
