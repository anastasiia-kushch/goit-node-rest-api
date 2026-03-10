import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import contactsRouter from './routes/contactsRouter.js';

import { connectDB } from './db/db.js';
import User from './models/user.js';
import Contact from './models/contact.js';
import authRouter from './routes/authRouter.js';

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);
app.use('/api/auth', authRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

connectDB().then(async () => {
  await User.sync({ alter: true });
  await Contact.sync({ alter: true });

  console.log('Tables ready');

  app.listen(3000, () => {
    console.log('Server is running. Use our API on port: 3000');
  });
});
