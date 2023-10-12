import * as contactsService from '../models/contacts.js';

import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';

const getContactsList = async (req, res) => {
  const result = await contactsService.listContacts();
  res.json(result);
};
// якщо виникає помилка в середині try, вона потрапляє в catch.
// catch бере помилку і передає некст.
// Некст бере помилку і починає перебирати всі
// колбеки та шукає той в якого 4 параметри.

const getById = async (req, res) => {
  const { id } = req.params;

  const result = await contactsService.getContactById(id);
  if (!result) {
    throw HttpError(404, `Contact with ${id} not found`);
  }
  res.json(result);
};

const addNewContact = async (req, res) => {
  // 1.Перевіряється чи тіло реквеста не пусте isEmptyBody
  // 2. перед додаванням, перевіряється на наявність обовʼязкових параметрів у тілі запиту відповідно до схеми
  // 3. до контроллера дійде черга, лише тоді коли тіло запиту буде відповідати схемі і не буде ніяких помилок
  const result = await contactsService.addContact(req.body);
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  // 1.Перевіряється чи тіло реквеста не пусте isEmptyBody
  // 2. перед додаванням, перевіряється на наявність обовʼязкових параметрів у тілі запиту відповідно до схеми
  // 3. до контроллера дійде черга, лтше тоді коли тіло запиту буде відповідати схемі і не буде ніяких помилок
  const { id } = req.params;
  const result = await contactsService.updateContactById(id, req.body);

  if (!result) {
    throw HttpError(404, `Contact with ${id} not found`);
  } // якщо повернеться null, то викидуємо 404 помилку

  res.status(201).json(result);
};

const removeById = async (req, res) => {
  const { id } = req.params;

  const result = await contactsService.removeContact(id);
  if (!result) {
    throw HttpError(404, `Contact with ${id} not found`);
  }
  res.json({ message: 'contact deleted' });
};

// експортуємо функції як один обʼєкт
export default {
  getContactsList: ctrlWrapper(getContactsList),
  getById: ctrlWrapper(getById),
  addNewContact: ctrlWrapper(addNewContact),
  updateById: ctrlWrapper(updateById),
  removeById: ctrlWrapper(removeById),
};
