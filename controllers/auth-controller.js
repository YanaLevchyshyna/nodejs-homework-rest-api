import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';

import { HttpError } from '../helpers/index.js';

import { ctrlWrapper } from '../decorators/index.js';

import dotenv from 'dotenv';
dotenv.config(); // Завантажити змінні середовища з файлу .env

const { JWT_SECRET } = process.env;
// console.log('JWT_SECRET:', JWT_SECRET);
// console.log('process.env :', process.env);

// пароль спочатку хешуємо, а потім вже зберігаємо в базі

const signup = async (req, res) => {
  const { email, password } = req.body;
  // перевіряємо чи в базі такий user по email
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, `Email ${email} in use.`);
  }

  // перед збереженням користувача, спочатку хешуємо пароль
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });
  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  // перевіряємо чи в базі такий user по email
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  // порівнюємо чи співпадає пароль який ввів юзер із паролем який є у базі
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });
  // expiresIn: '23h'  -  час життя токена (токен складається із закодованого заголовка,
  // закодованого пейлоада та зашифрованого підпису).

  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
  });
};

const getCurrent = async (req, res) => {
  const { username, email } = req.user;

  res.json({
    username,
    email,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: '' });
  res.json({ message: 'Not authorized' });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
};
