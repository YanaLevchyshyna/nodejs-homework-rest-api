import Joi from 'joi';
// створюємо обʼєкт в якому зазначаємо, які саме властивості мають бути обовʼязковими у тілі реквеста

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
});
