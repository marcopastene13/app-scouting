import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import playerRoutes from './routes/player.routes';
import clubRoutes from './routes/club.routes';
import needRoutes from './routes/need.routes';
import reportRoutes from './routes/report.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'ScoutChile API', version: '0.1.0' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/players', playerRoutes);
app.use('/api/v1/clubs', clubRoutes);
app.use('/api/v1/needs', needRoutes);
app.use('/api/v1/reports', reportRoutes);

app.listen(PORT, () => {
  console.log(`ScoutChile API corriendo en http://localhost:${PORT}`);
});

export default app;
