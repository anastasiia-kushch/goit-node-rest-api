import {
  registerUser,
  loginUser,
  logoutUser,
} from '../services/authServices.js';

import HttpError from '../helpers/HttpError.js';
import fs from 'fs';
import path from 'path';

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

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.user) {
      throw HttpError(401, 'Not authorized');
    }

    if (!req.file) {
      throw HttpError(400, 'File not provided');
    }

    const { path: tempPath, originalname } = req.file;
    const ext = path.extname(originalname);
    const filename = `${req.user.id}-${Date.now()}${ext}`;
    const publicDir = path.join('public', 'avatars');

    // ensure public/avatars exists
    await fs.promises.mkdir(publicDir, { recursive: true });

    const resultPath = path.join(publicDir, filename);

    await fs.promises.rename(tempPath, resultPath);

    const avatarURL = `/avatars/${filename}`;

    await req.user.update({ avatarURL });

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};
