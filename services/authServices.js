import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/user.js';
import HttpError from '../helpers/HttpError.js';
import { sendVerificationEmail } from '../helpers/emailService.js';

const SECRET_KEY = 'mysecretkey';

export async function registerUser(email, password) {
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email, { s: '250' }, true);

  const verificationToken = uuidv4();

  const newUser = await User.create({
    email,
    password: hashPassword,
    avatarURL,
    verify: false,
    verificationToken,
  });

  await sendVerificationEmail(email, verificationToken);

  return newUser;
}

export async function loginUser(email, password) {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  if (!user.verify) {
    throw HttpError(401, 'Email not verified');
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

export async function verifyUser(verificationToken) {
  const user = await User.findOne({ where: { verificationToken } });

  if (!user) {
    throw HttpError(404, 'User not found');
  }

  await user.update({ verify: true, verificationToken: null });

  return user;
}

export async function resendVerificationEmail(email) {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw HttpError(404, 'User not found');
  }

  if (user.verify) {
    throw HttpError(400, 'Verification has already been passed');
  }

  const verificationToken = user.verificationToken || uuidv4();

  await user.update({ verificationToken });
  await sendVerificationEmail(email, verificationToken);

  return;
}
