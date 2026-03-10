import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const SECRET_KEY = 'mysecretkey';

const auth = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      message: 'Not authorized',
    });
  }

  const [bearer, token] = header.split(' ');

  if (bearer !== 'Bearer') {
    return res.status(401).json({
      message: 'Not authorized',
    });
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);

    const user = await User.findByPk(id);

    if (!user || user.token !== token) {
      return res.status(401).json({
        message: 'Not authorized',
      });
    }

    req.user = user;

    next();
  } catch {
    return res.status(401).json({
      message: 'Not authorized',
    });
  }
};

export default auth;
