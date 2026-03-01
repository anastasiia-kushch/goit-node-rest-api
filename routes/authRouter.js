import express from 'express';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

const SECRET_KEY = 'mysecretkey';

const schema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

// -------- REGISTER --------
router.post('/register', async (req, res) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  const { email, password } = req.body;

  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    return res.status(409).json({
      message: 'Email in use',
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashPassword,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
});

// -------- LOGIN --------
router.post('/login', async (req, res) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({
      message: 'Email or password is wrong',
    });
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    return res.status(401).json({
      message: 'Email or password is wrong',
    });
  }

  const payload = { id: user.id };

  const token = jwt.sign(payload, SECRET_KEY);

  await user.update({ token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

// -------- LOGOUT --------

router.post('/logout', auth, async (req, res) => {
  await req.user.update({
    token: null,
  });

  res.status(204).send();
});

// -------- GET CURRENT USER --------
router.get('/current', auth, async (req, res) => {
  res.json({
    email: req.user.email,
    subscription: req.user.subscription,
  });
});

export default router;
