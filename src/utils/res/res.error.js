

export const errorResponse = ({ res, message, statusCode }) => {
  throw new Error(res.__(message), { cause: statusCode })
};