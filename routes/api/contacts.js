import express from 'express';
import contactsController from '../../controllers/contacts-controller.js';
import { isEmptyBody, isValidId } from '../../middlewares/index.js';
import { validateBody } from '../../decorators/index.js';
import {
  contactAddSchema,
  contactUpdateFavoriteSchema,
} from '../../models/Contact.js';

// в декоратор передаємо нашу схему
const contactAddValidate = validateBody(contactAddSchema);

const contactUpdateFavoriteValidate = validateBody(contactUpdateFavoriteSchema);

const contactsRouter = express.Router();

contactsRouter.get('/', contactsController.getContactsList);

contactsRouter.get('/:id', isValidId, contactsController.getById);

contactsRouter.post(
  '/',
  isEmptyBody,
  contactAddValidate,
  contactsController.addNewContact
);

contactsRouter.delete('/:id', isValidId, contactsController.removeById);

contactsRouter.put(
  '/:id',
  isValidId,
  isEmptyBody,
  contactAddValidate,
  contactsController.updateById
);

contactsRouter.patch(
  '/:id/favorite',
  isValidId,
  isEmptyBody,
  contactUpdateFavoriteValidate,
  contactsController.updateFavotiteById
);

export default contactsRouter;
