import { Request, Response, NextFunction } from 'express';

const apiKeys = new Set(['secret9522']);

export const authenticateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey: string | undefined = req.get('X-API-KEY');

  if (apiKey && apiKeys.has(apiKey)) {
    next();
  } else {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
};
