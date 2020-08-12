import { Request, Response, NextFunction } from 'express';
import { ALLOWED_REQUEST_METHOD, ALLOWED_CONTENT_TYPE } from '../constants';

export const bodyCollectorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const REQUEST_METHOD = req.method.toUpperCase();
    const CONTENT_TYPE = req.headers["content-type"];

    if (REQUEST_METHOD === ALLOWED_REQUEST_METHOD && CONTENT_TYPE === ALLOWED_CONTENT_TYPE) {
        let buffer = Buffer.from([]);

        req.on('data', (chunk: any) => {
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
