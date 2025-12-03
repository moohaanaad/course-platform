

export function parseJsonFields(req, res, next) {

  for (const key in req.body) {
    const value = req.body[key];

    if (typeof value === "string") {

      if (value.startsWith("{") || value.startsWith("[")) {
        try {
          req.body[key] = JSON.parse(value);
        } catch (err) {
          return res.status(400).json({
            message: `Invalid JSON format in field "${key}"`
          });
        }
      }
    }
  }
  next()
}
