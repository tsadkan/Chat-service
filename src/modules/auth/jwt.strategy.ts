import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from "@nestjs/common";
import { APP_CONFIG } from "src/app.config";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: APP_CONFIG.jwtSecret,
        })
    }

    async validate(payload: any) {
        return { _id: payload._id, username: payload.username, email: payload.email};
    }
}