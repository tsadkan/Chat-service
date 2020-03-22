import { Controller, Get, Post, Body, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "../user/models/user";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { UserDto } from "../user/models/user-dto";

@Controller()
export class AuthController {
    constructor( private readonly authService: AuthService) {}

    @Post('auth/login')
    async login(@Body() user: UserDto): Promise<any> {
        return await this.authService.login(user.email, user.password);
    }

    @Post('auth/refresh-token')
    async refreshToken(@Body() body: { refreshToken: string}): Promise<any> {
        return await this.authService.refreshToken(body.refreshToken);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}