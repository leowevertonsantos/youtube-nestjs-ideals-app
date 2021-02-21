import { Request, Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request: Request = context.getRequest();
    const response: Response = context.getResponse();

    const errorResponse = {
      statusCode: exception?.getStatus(),
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      message: exception.message || '',
    };

    Logger.error(
      `${request.method} - ${request.url}`,
      JSON.stringify(errorResponse),
      'HttpErrorFilter',
    );

    response.status(exception?.getStatus()).json(errorResponse);
  }
}
