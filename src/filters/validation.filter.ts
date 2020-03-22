import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { ValidationException } from "./validation.exception";

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: ValidationException, host: ArgumentsHost) {
        const ctx = host.switchToHttp(),
                request = ctx.getRequest(),
                response = ctx.getResponse();

        return response.status(400).json({
            statusCode: 400,
            timeStamp: new Date().toISOString(),
            path: request.url,
            createdBy: 'ValidationFilter',
            validationErrors: exception.getValidationErrors(),
        })
    }
}