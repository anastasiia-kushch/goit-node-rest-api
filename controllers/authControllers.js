import {
  registerUser,
  loginUser,
  logoutUser,
} from '../services/authServices.js';

import HttpError from '../helpers/HttpError.js';

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const newUser = await registerUser(email, password);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { token, user } = await loginUser(email, password);

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (!req.user) {
      throw HttpError(401, 'Not authorized');
    }

    await logoutUser(req.user);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    if (!req.user) {
      throw HttpError(401, 'Not authorized');
    }

    res.json({
      email: req.user.email,
      subscription: req.user.subscription,
    });
  } catch (error) {
    next(error);
  }
};
