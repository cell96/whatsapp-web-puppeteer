import express from 'express';
import rateLimit from 'express-rate-limit';
import * as messageController from '../controllers/messageController';

const router = express.Router();

const messageRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message:
    'Too many messages sent from this IP, please try again after 15 minutes',
});

router.post('/send-message', messageRateLimit, messageController.sendMessage);

export default router;
