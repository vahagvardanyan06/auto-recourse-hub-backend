import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    
    const response = context.getResponse<Response>();
    
    let status = 500;
    let message = 'internal server error';
    console.log(exception);
    
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse()['message'] || message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: message,
    });
  }
}