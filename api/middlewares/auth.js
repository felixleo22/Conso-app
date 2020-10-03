const jwt = require('jsonwebtoken');
const User = require('../models/User');

// middlewares
module.exports = (req, res, next) => {
  // verify if header contains token
  if (!req.headers.authorization) {
    next();
    return;
  }

  // get the token
  const token = req.headers.authorization;

  // verify et decode token
  jwt.verify(token, 'test', (err, decoded) => {
    if (err) throw err;

    if (!decoded || !decoded.id) {
      next();
      return;
    }

    User.findById(decoded.id, (err2, user) => {
      if (err2) throw err2;

      if (!user) {
        next();
        return;
      }

      req.authUser = user;
      next();
    });
  });
};
