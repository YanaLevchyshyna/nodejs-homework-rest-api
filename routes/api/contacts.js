import express from 'express';
import contactsController from '../../controllers/contacts-controller.js';
import { isEmptyBody } from '../../middlewares/index.js';
import { validateBody } from '../../decorators/index.js';
import { contactAddSchema } from '../../schemas/contact-schemas.js';

// в декоратор передаємо нашу схему
const contactAddValidate = validateBody(contactAddSchema);

const contactsRouter = express.Router();

contactsRouter.get('/', contactsController.getContactsList);

contactsRouter.get('/:id', contactsController.getById);

contactsRouter.post(
  '/',
  isEmptyBody,
  contactAddValidate,
  contactsController.addNewContact
);

contactsRouter.delete('/:id', contactsController.removeById);

contactsRouter.put(
  '/:id',
  isEmptyBody,
  contactAddValidate,
  contactsController.updateById
);

export default contactsRouter;
