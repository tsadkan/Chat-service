import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/models/user';
import { APP_CONFIG } from 'src/app.config';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ){}

    async validateUser(user: User, password: string): Promise<boolean>{
        if(!user) return null;

        return await user.schema.methods.comparePassword(password, user);
    }

    async generateToken(user: User, accessTokenExpires?:string, refreshTokenExpires?: string) {
        return {
            accessToken: this.jwtService.sign(user, accessTokenExpires ? {
                expiresIn: accessTokenExpires
            } : {}),
            refreshToken: this.jwtService.sign(user, refreshTokenExpires ? {
                expiresIn: refreshTokenExpires
            } : {}),
            user
        };
    }

    async login(email: string, password: string): Promise<any> {
        const user = await this.userService.findOne({ email });

        if(!user) throw new BadRequestException('User not found');
        
        const isvalid = await this.validateUser(user, password);
        if(!isvalid) throw new BadRequestException('Invalid credintials');

        const serializedUser = user     chema.methods.serialize(user);
        
        return this.generateToken(serializedUser, APP_CONFIG.accessTokenExpires, APP_CONFIG.refreshTokenExpires);
    }

    async refreshToken(token: string): Promise<any> {
        const user: User = this.jwtService.verify(token);

        return this.generateToken(user);
    }
}
