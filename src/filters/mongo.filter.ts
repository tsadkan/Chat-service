import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError
    , host: ArgumentsHost) {
    console.log(exception)
    const ctx = host.switchToHttp(),
            response = ctx.getResponse(),
            request = ctx.getRequest();
        
    switch (exception.code) {
      case 11000:
        response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: exception.errmsg,
          timeStamp: new Date().toISOString(),
          path: request.url,
          createdBy: 'MongoFilter',
      })
    }
  }
}