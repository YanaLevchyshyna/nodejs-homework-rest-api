const messageErrorList = Object.freeze({
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
});

const HttpError = (status, message = messageErrorList[status]) => {
  const error = new Error(message); //  створюємо новий обʼєкт помилки

  error.status = status;
  return error;
};

export default HttpError;
