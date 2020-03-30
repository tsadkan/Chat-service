import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { APP_CONFIG } from "src/app.config";

export class JwtWsStrategy extends PassportStrategy(Strategy, 'jwtws') {
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
            ignoreExpiration: false,
            secretOrKey: APP_CONFIG.jwtSecret,
        })
    }

    async validate(payload: any) {
        return { _id: payload._id, username: payload.username, email: payload.email};
    }
}