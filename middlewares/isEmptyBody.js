import { HttpError } from '../helpers/index.js';

// Перевірка чи тіло реквеста не пусте
const isEmptyBody = (req, res, next) => {
  if (!Object.keys(req.body).length) {
    return next(HttpError(400, 'All fields are empty'));
  }
  next();
};

export default isEmptyBody;
