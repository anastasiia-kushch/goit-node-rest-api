import express from 'express';
import {
  register,
  login,
  logout,
  getCurrent,
  updateAvatar,
  verifyEmail,
  resendVerification,
} from '../controllers/authControllers.js';
import validateBody from '../helpers/validateBody.js';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
} from '../schemas/authSchemas.js';
import auth from '../middlewares/auth.js';
import multer from 'multer';

const upload = multer({ dest: 'temp/' });

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);

router.post('/login', validateBody(loginSchema), login);

router.get('/verify/:verificationToken', verifyEmail);

router.post('/verify', validateBody(verifyEmailSchema), resendVerification);

router.post('/logout', auth, logout);

router.get('/current', auth, getCurrent);

router.patch('/avatars', auth, upload.single('avatar'), updateAvatar);

export default router;
