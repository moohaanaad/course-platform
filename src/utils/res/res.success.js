

export const successResponse = ({ res, message, data, statusCode = 200 }) => {
    return res.status(statusCode).json({
        success: true,
        message: res.__(message),
        data,
        timestamp: new Date().toISOString(),
    });
};