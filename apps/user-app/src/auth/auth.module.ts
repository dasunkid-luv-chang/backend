import { Module } from "@nestjs/common"
import { UserModule } from "../user/user.module"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { RmqModule, TokenService } from "@app/common"
import { MAIL_SERVICE } from "./constants/service"
import { JwtService } from "@nestjs/jwt"

@Module({
  imports: [UserModule, RmqModule.register({ name: MAIL_SERVICE })],
  controllers: [AuthController],
  providers: [AuthService, JwtService, TokenService],
})
export class AuthModule {}
