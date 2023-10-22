import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config(); // Завантажити змінні середовища з файлу .env

const { JWT_SECRET } = process.env;
console.log('JWT_SECRET:', JWT_SECRET);

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  const [bearer, token] = authorization.split(' '); // деструктуризуємо масив
  // у нашому випадку метод split повертає масив з двох слів: bearer та token
  if (bearer !== 'Bearer') {
    throw HttpError(401);
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET); //   перевіряємо токен на валідність: чи зашифрований токен і чи термін дії не закінчився

    const user = await User.findById(id);
    if (!user || !user.token) {
      throw HttpError(401);
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401));
  }
};

export default ctrlWrapper(authenticate);
