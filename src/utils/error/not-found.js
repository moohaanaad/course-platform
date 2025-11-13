

export const notFound = (req, res, next) => {
    return next(new Error("invaled url", { cause: 404 }))
}