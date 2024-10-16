function checkContentType(req, res, next) {
  const contentType = req.headers["content-type"];

  if (contentType === "application/json") return next();

  res.status(400).send({
    success: false,
    message: "Invalid Content-Type. Expected application/json.",
  });
}

module.exports = checkContentType;
