

export const successResponse = ({ res, message, data, statusCode = 200, success = true }) => {
    return res.status(statusCode).json({
        success,
        message: res.__(message),
        data,
        timestamp: new Date().toISOString(),
    });
};