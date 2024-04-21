import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { IResponse } from 'src/interfaces/response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    
    const response = context.getResponse<Response>();
    
    let status = 500;
    let message = 'internal server error';
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse()['message'] || message;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      success : false
    }as IResponse ) ;
  }
}