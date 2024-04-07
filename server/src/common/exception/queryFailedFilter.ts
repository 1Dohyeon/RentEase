import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception.message.includes("Unknown column 'user.userId'")) {
      response.status(status).json({
        statusCode: status,
        message: 'Unknown column in field list: user.userId',
      });
    } else {
      // 다른 예외에 대한 기본 처리
      response.status(status).json({
        statusCode: status,
        message: 'Internal Server Error',
      });
    }
  }
}
