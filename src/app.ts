import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import logger from './utils/logger';
import router from './routes/api';
import { authenticateApiKey } from './middleware/authenticateApiKey';

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', authenticateApiKey, router);

app.get('/', (req, res) => {
  logger.info('Hello World endpoint called');
  res.send('Hello World!');
});

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});
