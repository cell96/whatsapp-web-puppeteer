"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const logger_1 = __importDefault(require("../utils/logger"));
function initWhatsApp() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            userDataDir: './user_data',
        });
        const page = yield browser.newPage();
        yield page.goto('https://web.whatsapp.com');
        return { browser, page };
    });
}
function sendMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { number, message } = req.body;
        const { browser, page } = yield initWhatsApp();
        const numbers = Array.isArray(number) ? number : [number];
        const LOGGED_OUT_SELECTOR = '.landing-title';
        const NEW_CHAT_BUTTON_SELECTOR = 'span[data-icon="new-chat-outline"]';
        const CHAT_OPEN_SELECTOR = 'span[data-icon="search-alt"]';
        const FILTER_OPEN_SELECTOR = 'span[data-icon="community-group"]';
        try {
            if (yield page.$(LOGGED_OUT_SELECTOR)) {
                logger_1.default.info('Waiting for user to log in');
                yield page.waitForSelector(LOGGED_OUT_SELECTOR, {
                    hidden: true,
                    timeout: 60000,
                });
            }
            for (const num of numbers) {
                logger_1.default.info(`Sending message: ${message} to: ${num}`);
                yield page.waitForSelector(NEW_CHAT_BUTTON_SELECTOR);
                yield page.click(NEW_CHAT_BUTTON_SELECTOR);
                yield page.keyboard.type(num);
                yield page.waitForFunction((selector) => !document.querySelector(selector), {}, FILTER_OPEN_SELECTOR);
                yield page.keyboard.press('Enter');
                // Wait for chat to open
                const isChatOpen = yield page.waitForSelector(CHAT_OPEN_SELECTOR);
                if (isChatOpen) {
                    yield page.keyboard.type(message);
                    yield page.keyboard.press('Enter');
                }
                else {
                    logger_1.default.error('Chat is not open');
                }
                // Add a delay between messages if sending to multiple numbers
                if (numbers.length > 1) {
                    yield new Promise((r) => setTimeout(r, 1000));
                }
            }
            res.status(200).send('Message sent successfully');
        }
        catch (error) {
            logger_1.default.error('Error sending message:', error);
            res.status(500).send('Failed to send message');
        }
        finally {
            // Timeout so the browser doesn't close too fast
            yield new Promise((r) => setTimeout(r, 1000));
            yield browser.close();
        }
    });
}
exports.sendMessage = sendMessage;
