export const handleSaveError = (error, data, next) => {
  // console.log(error.name);
  // console.log(error.code);
  const { name, code } = error;
  error.status = name === 'MongoServerError' && code === 11000 ? 409 : 400;
  // якщо імʼя помилки MongoServerError та код 11000 то помилка зі статусом 409, в ін випадку 400.
  next();
};

export const runValidatorsAtUpdate = function (next) {
  this.options.runValidator = true; // проходить валідвцію навіть під час оновлення
  this.options.new = true; // повертає новий елемент
  next();
};
