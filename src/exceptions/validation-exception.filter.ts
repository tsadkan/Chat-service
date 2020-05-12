import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { ValidationException } from './validation.exception';
import { HttpResponseBody } from './http-exception-responsne-body';

/**
 * catch only validation exceptions to add
 * the customized validation error messages to the response
 */
@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(),
      request = ctx.getRequest(),
      response = ctx.getResponse();

    const responseBody: HttpResponseBody = {
      statusCode: exception.getStatus(),
      timeStamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
      error: exception.getValidationErrors(),
    };

    return response.status(exception.getStatus()).json(responseBody);
  }
}
