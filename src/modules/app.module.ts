import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_CONFIG } from '../app.config';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: APP_CONFIG.jwtSecret,
    }),
    MongooseModule.forRoot(APP_CONFIG.databaseURL, {
      useCreateIndex: true,
      useNewUrlParser: true
    }),
    AuthModule,
    UserModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST }
      )
      .forRoutes(AuthController, UserController);
  }
}