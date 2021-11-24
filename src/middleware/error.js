const malformattedIdHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message });
  }

  next(err);
};

module.exports = malformattedIdHandler;
