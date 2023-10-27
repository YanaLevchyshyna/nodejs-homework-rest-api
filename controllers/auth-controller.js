import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import Jimp from 'jimp';
import fs from 'fs/promises';
import path from 'path';
import User from '../models/User.js';
import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';

const avatarPath = path.resolve('public', 'avatars');
// console.log('avatarPath', avatarPath);

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
    throw HttpError(409, `Email ${email} is used.`);
  }

  // перед збереженням користувача, спочатку хешуємо пароль
  const hashPassword = await bcrypt.hash(password, 10);

  const normilizedEmail = email.toLowerCase().trim();
  const unSecureUrl = gravatar.url(normilizedEmail, {
    protocol: 'http',
  });

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL: unSecureUrl,
  });
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

const createAvatar = async (req, res) => {
  const { _id } = req.user;
  const { avatarURL } = req.body;
  // console.log('avatarURL', avatarURL);

  // console.log('req.user', req.user);
  // console.log('req.body', req.body);
  // console.log('req.file', req.file);

  const { path: oldPath, filename } = req.file;

  await Jimp.read(oldPath)
    .then((avatar) => {
      return avatar.cover(250, 250).quality(60).write(oldPath);
    })
    .catch((err) => {
      throw err;
    });

  const newPath = path.join(avatarPath, filename);
  await fs.rename(oldPath, newPath);
  const userAvatar = path.join('avatars', filename); // шлях відносно кореня проєкту
  // console.log('userAvatar', userAvatar);

  const user = await User.findByIdAndUpdate(_id, { avatarURL: userAvatar });
  console.log('user', user);
  if (!user) {
    throw HttpError(401, (message = `Not authorized`));
  }
  res.status(201).json({ avatarURL: user.avatarURL });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  createAvatar: ctrlWrapper(createAvatar),
};
