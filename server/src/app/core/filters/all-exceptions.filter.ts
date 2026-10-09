import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    // Log the full exception stack trace internally
    if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`[Unhandled Exception] ${exception}`, exception instanceof Error ? exception.stack : '');
    } else {
      this.logger.warn(`[HTTP Error] ${httpStatus}`, JSON.stringify(message));
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      // Extract string message if it's an object with a message property, or fallback
      message: typeof message === 'object' && message !== null && 'message' in message
        ? (message as any).message
        : message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
