

function responseHandler(res, {msg, status, statusCode, data = null, error = null}) {
  const responseObj = {msg, status, statusCode};
  if (data) {
    responseObj.data = data;
  }
  if (error) {
    responseObj.error = error;
  }
  return res.status(statusCode).json(responseObj);
}

export {
  responseHandler
};