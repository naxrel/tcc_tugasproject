const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer '))
    return res.status(401).json({ status: 'fail', message: 'Token tidak ada' });

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, no_hp, email, ... }
    next();
  } catch (err) {
    return res.status(401).json({ status: 'fail', message: 'Token tidak valid atau expired' });
  }
};
