import { Schema, model } from 'mongoose';
import { handleSaveError, runValidatorsAtUpdate } from '../models/hooks.js';
import Joi from 'joi';
// створюємо обʼєкт в якому зазначаємо, які саме властивості мають бути обовʼязковими у тілі реквеста

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user', // назва колекції з якої цей Id
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post('save', handleSaveError); // якщо при збереженні нового контакту буде помилка,
// то помилка буде викинута хуком handleSaveError.

contactSchema.pre('findOneAndUpdate', runValidatorsAtUpdate);

export const contactAddSchema = Joi.object({
  id: Joi.any(),
  name: Joi.string().required().messages({
    'any.required': `missing required field "title"`,
  }),
  email: Joi.string().required().messages({
    'any.required': `missing required field "email"`,
  }),
  phone: Joi.string().required().messages({
    'any.required': `missing required field "phone"`,
  }),
  favorite: Joi.boolean(),
});

export const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

// Joi перевіряє те що нам приходить, тіло запиту!
// Mongoose Schema перевіряє те, що ми зберігаємо into database!!!

const Contact = model('contact', contactSchema);

export default Contact;
