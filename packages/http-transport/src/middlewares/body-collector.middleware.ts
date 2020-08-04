import { Request, Response, NextFunction } from 'express';
import { ALLOWED_CONTENT_TYPE } from '../constants';

export const bodyCollectorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const UPPER_CASE_HEADER = req.method.toUpperCase();
    const CONTENT_TYPE = req.headers["content-type"];

    if (UPPER_CASE_HEADER === 'POST' && CONTENT_TYPE === ALLOWED_CONTENT_TYPE) {
        let buffer = Buffer.from([]);

        req.on('data', (chunk) => {
            buffer = Buffer.concat([buffer, chunk]);
        });

        req.on('end', () => {
            req.body = buffer;
            next();
        });
    } else {
        next();
    }
}
