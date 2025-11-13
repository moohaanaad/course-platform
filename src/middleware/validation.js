

export const isValid = (schema) => {
    return (req, res, next) => {
        try {
            
            const data = { ...req.body, ...req.query, ...req.params }
            const { error } = schema.validate(data, { abortEarly: false, context: req })
            if (error) {
                const errArr = []
                error.details.forEach(err => errArr.push(err.message));
                return next(new Error(errArr, { cause: 400 }))
            }
            next()
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}