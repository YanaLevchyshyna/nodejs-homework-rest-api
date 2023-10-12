import { HttpError } from '../helpers/index.js';

const validateBody = (schema) => {
  const func = (req, res, next) => {
    // 2. перед додаванням, перевіряємо на наявність обовʼязкових параметрів у тілі запиту відповідно до схеми
    const { error } = schema.validate(req.body);
    if (error) {
      return next(HttpError(400, 'missing fields'));
    }
    next();
  };
  return func;
};
export default validateBody;
