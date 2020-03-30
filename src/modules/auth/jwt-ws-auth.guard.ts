import { AuthGuard } from "@nestjs/passport";
import { Injectable, ExecutionContext } from "@nestjs/common";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwtws') {
    getRequest(context: ExecutionContext) {
        return context.switchToWs().getClient().handshake;
    }
}