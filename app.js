import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import contactsRouter from './routes/api/contacts.js';
import authRouter from './routes/api/auth-router.js';

dotenv.config();

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json()); // мідлвара яка дивиться чи є контент тайп,
// якщо він є і якщо це аплікейшн JSON, бере його,
// пропускає через ф-ю JSON - парс, отримує обʼєкт або масив і записує у реквест боді

app.use('/api/contacts', contactsRouter);
app.use('/api/auth', authRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

export default app;
