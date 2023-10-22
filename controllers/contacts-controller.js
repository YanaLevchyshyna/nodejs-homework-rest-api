import Contact from '../models/Contact.js';

import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';

const getContactsList = async (req, res) => {
  const { _id: owner } = req.user;

  const { page = 1, limit = 15 } = req.query;
  const skip = (page - 1) * limit;

  const result = await Contact.find({ owner }, '-createdAt -updatedAt', {
    skip,
    limit,
  }).populate('owner', 'username email');

  res.json(result);
};

// якщо виникає помилка в середині try, вона потрапляє в catch.
// catch бере помилку і передає некст.
// Некст бере помилку і починає перебирати всі колбеки та шукає той в якого 4 параметри.

const getById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await Contact.findOne({ _id: id, owner }); // знайди мені контакт з таким id, який додала ця людина

  // const result = await Contact.findById(id);

  if (!result) {
    throw HttpError(404, `Contact with ${id} is not found`);
  }
  res.json(result);
};

const addNewContact = async (req, res) => {
  const { _id: owner } = req.user;
  // 1.Перевіряється чи тіло реквеста не пусте isEmptyBody
  // 2. перед додаванням, перевіряється на наявність обовʼязкових параметрів у тілі запиту відповідно до схеми
  // 3. до контроллера дійде черга, лише тоді коли тіло запиту буде відповідати схемі і не буде ніяких помилок
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  // 1.Перевіряється чи тіло реквеста не пусте isEmptyBody
  // 2. перед додаванням, перевіряється на наявність обовʼязкових параметрів у тілі запиту відповідно до схеми
  // 3. до контроллера дійде черга, лтше тоді коли тіло запиту буде відповідати схемі і не буде ніяких помилок
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body);

  if (!result) {
    throw HttpError(404, `The contact with ${id} is not found`);
  } // якщо повернеться null, то викидуємо 404 помилку

  res.status(201).json(result);
};

const updateFavotiteById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw HttpError(404, `The contact with ${id} is not found`);
  } // якщо повернеться null, то викидуємо 404 помилку

  res.status(201).json(result);
};

const removeById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await Contact.findOneAndDelete({ _id: id, owner });
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
