"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = __importDefault(require("./utils/logger"));
const api_1 = __importDefault(require("./routes/api"));
const authenticateApiKey_1 = require("./middleware/authenticateApiKey");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api', authenticateApiKey_1.authenticateApiKey, api_1.default);
app.get('/', (req, res) => {
    logger_1.default.info('Hello World endpoint called');
    res.send('Hello World!');
});
app.listen(port, () => {
    logger_1.default.info(`Server is running at http://localhost:${port}`);
});
