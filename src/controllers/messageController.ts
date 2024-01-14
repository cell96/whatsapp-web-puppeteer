import puppeteer from 'puppeteer';
import { Request, Response } from 'express';
import logger from '../utils/logger';

async function initWhatsApp() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    userDataDir: './user_data',
  });

  const page = await browser.newPage();

  await page.goto('https://web.whatsapp.com');

  return { browser, page };
}

async function sendMessage(req: Request, res: Response) {
  const { number, message } = req.body;
  const { browser, page } = await initWhatsApp();
  const numbers = Array.isArray(number) ? number : [number];

  const LOGGED_OUT_SELECTOR = '.landing-title';
  const NEW_CHAT_BUTTON_SELECTOR = 'span[data-icon="new-chat-outline"]';
  const CHAT_OPEN_SELECTOR = 'span[data-icon="search-alt"]';
  const FILTER_OPEN_SELECTOR = 'span[data-icon="community-group"]';

  try {
    if (await page.$(LOGGED_OUT_SELECTOR)) {
      logger.info('Waiting for user to log in');

      await page.waitForSelector(LOGGED_OUT_SELECTOR, {
        hidden: true,
        timeout: 60000,
      });
    }

    await new Promise((r) => setTimeout(r, 1000));

    for (const num of numbers) {
      logger.info(`Sending message: ${message} to: ${num}`);

      await page.waitForSelector(NEW_CHAT_BUTTON_SELECTOR);

      await page.click(NEW_CHAT_BUTTON_SELECTOR);
      await page.keyboard.type(num);

      await page.waitForFunction(
        (selector) => !document.querySelector(selector),
        {},
        FILTER_OPEN_SELECTOR
      );

      await page.keyboard.press('Enter');

      // Wait for chat to open
      const isChatOpen = await page.waitForSelector(CHAT_OPEN_SELECTOR);

      if (isChatOpen) {
        await page.keyboard.type(message);
        await page.keyboard.press('Enter');
      } else {
        logger.error('Chat is not open');
      }

      // Add a delay between messages if sending to multiple numbers
      if (numbers.length > 1) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    res.status(200).send('Message sent successfully');
  } catch (error) {
    logger.error('Error sending message:', error);

    res.status(500).send('Failed to send message');
  } finally {
    // Timeout so the browser doesn't close too fast
    await new Promise((r) => setTimeout(r, 1000));
    await browser.close();
  }
}

export { sendMessage };
