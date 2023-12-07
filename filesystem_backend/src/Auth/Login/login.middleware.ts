import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { context, trace } from '@opentelemetry/api';

@Injectable()
export class loginMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const payload = req.body;

    const traceInfo = trace.getSpan(context.active());

    if (traceInfo) {
      traceInfo.setAttribute('login_payload', JSON.stringify(payload));
    }
    next();
  }
}
