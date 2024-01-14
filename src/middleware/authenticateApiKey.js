"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateApiKey = void 0;
const apiKeys = new Set(['secret9522']);
const authenticateApiKey = (req, res, next) => {
    const apiKey = req.get('X-API-KEY');
    if (apiKey && apiKeys.has(apiKey)) {
        next();
    }
    else {
        return res.status(401).json({ error: 'Invalid or missing API key' });
    }
};
exports.authenticateApiKey = authenticateApiKey;
