import { ExceptionFilter, Catch, HttpException, ArgumentsHost } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp(),
            response = ctx.getResponse(),
            status = exception.getStatus(),
            request = ctx.getRequest();

        
        response.status(status).json({
            statusCode: status,
            message: exception.getResponse()['message'],
            timeStamp: new Date().toISOString(),
            path: request.url,
            createdBy: 'HttpFilter',
        })
    }
}