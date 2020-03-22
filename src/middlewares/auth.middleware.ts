import { NestMiddleware, UnauthorizedException, Injectable } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "@nestjs/jwt";
import { IncomingHttpHeaders } from "http";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService){}

    use(req: Request, res: Response, next: NextFunction) {
        try {
            const headers: IncomingHttpHeaders = req.headers;
            const authorization: string = headers.authorization;
            const bearerToken: string[] = authorization.split(' ');
            const token: string = bearerToken[1];

            this.jwtService.verify(token)
            next();
        } catch(error) {
            throw new UnauthorizedException();
        }   
    }
}