

export const errorResponse = ({ message, statusCode }) => {
  throw new Error(message, { cause: statusCode })
};