import Contact from '../models/Contact.js';

import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';

const getContactsList = async (req, res) => {
  const result = await Contact.find();
  res.json(result);
};
// якщо виникає помилка в середині try, вона потрапляє в catch.
// catch бере помилку і передає некст.
// Некст бере помилку і починає перебирати всі
// колбеки та шукає той в якого 4 параметри.

const getById = async (req, res) => {
  const { id } = req.params;
  // onst result = await Contact.findOne({_id: id}); це пошук за параметрами!
  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, `Contact with ${id} is not found`);
  }
  res.json(result);
};

const addNewContact = async (req, res) => {
  // 1.Перевіряється чи тіло реквеста не пусте isEmptyBody
  // 2. перед додаванням, перевіряється на наявність обовʼязкових параметрів у тілі запиту відповідно до схеми
  // 3. до контроллера дійде черга, лише тоді коли тіло запиту буде відповідати схемі і не буде ніяких помилок
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  // 1.Перевіряється чи тіло реквеста не пусте isEmptyBody
  // 2. перед додаванням, перевіряється на наявність обовʼязкових параметрів у тілі запиту відповідно до схеми
  // 3. до контроллера дійде черга, лтше тоді коли тіло запиту буде відповідати схемі і не буде ніяких помилок
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw HttpError(404, `Contact with ${id} not found`);
  } // якщо повернеться null, то викидуємо 404 помилку

  res.status(201).json(result);
};

const updateFavotiteById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw HttpError(404, `Contact with ${id} not found`);
  } // якщо повернеться null, то викидуємо 404 помилку

  res.status(201).json(result);
};

const removeById = async (req, res) => {
  const { id } = req.params;

  const result = await Contact.findByIdAndDelete(id);
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
  updateFavotiteById: ctrlWrapper(updateFavotiteById),
  removeById: ctrlWrapper(removeById),
};
