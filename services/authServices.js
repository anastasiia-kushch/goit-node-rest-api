import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import HttpError from '../helpers/HttpError.js';

const SECRET_KEY = 'mysecretkey';

export async function registerUser(email, password) {
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashPassword,
  });

  return newUser;
}

export async function loginUser(email, password) {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const payload = { id: user.id };

  const token = jwt.sign(payload, SECRET_KEY);

  await user.update({ token });

  return { token, user };
}

export async function logoutUser(user) {
  await user.update({ token: null });
}
