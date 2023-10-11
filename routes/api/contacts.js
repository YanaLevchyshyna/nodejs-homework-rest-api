import express from 'express';
import Joi from 'joi';
import * as contactsService from '../../models/contacts.js';

import { HttpError } from '../../helpers/index.js';

const contactsRouter = express.Router();

// створюємо обʼєкт в якому зазначаємо, які саме властивості мають бути обовʼязковими у тілі реквеста
const contactAddSchema = Joi.object({
  id: Joi.any(),
  name: Joi.string().required().messages({
    'any.required': `missing required field "title"`,
  }),
  email: Joi.string().required().messages({
    'any.required': `missing required field "email"`,
  }),
  phone: Joi.number().required().messages({
    'any.required': `missing required field "phone"`,
  }),
});

contactsRouter.get('/', async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// якщо виникає помилка в середині try, вона потрапляє в catch.
// catch бере помилку і передає некст.
// Некст бере помилку і починає перебирати всі
// колбеки та шукає той в якого 4 параметри.

contactsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await contactsService.getContactById(id);
    if (!result) {
      throw HttpError(404, `Contact with ${id} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

contactsRouter.post('/', async (req, res, next) => {
  try {
    // Перевіряємо чи тіло реквеста не пусте
    if (!Object.keys(req.body).length) {
      throw new Error(400, 'missing required name field');
    }
    // перед додаванням, перевіряємо на наявність обовʼязкових параметрів у тілі запиту відповідно до схеми
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

contactsRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await contactsService.removeContact(id);
    if (!result) {
      throw HttpError(404, `Contact with ${id} not found`);
    }
    res.json({ message: 'contact deleted' });
  } catch (error) {
    next(error);
  }
});

contactsRouter.put('/:id', async (req, res, next) => {
  try {
    // Перевіряємо чи тіло реквеста не пусте
    if (!Object.keys(req.body).length) {
      throw new Error(400, 'All fields are empty');
    }

    // перед додаванням, перевіряємо на наявність обовʼязкових параметрів у тілі запиту відповідно до схеми
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, 'missing fields');
    }

    const { id } = req.params;
    const result = await contactsService.updateContactById(id, req.body);

    if (!result) {
      throw HttpError(404, `Contact with ${id} not found`);
    } // якщо повернеться null, то викидуємо 404 помилку

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

export default contactsRouter;
