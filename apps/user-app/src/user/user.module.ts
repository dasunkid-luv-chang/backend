import { DatabaseModule, TokenService } from "@app/common"
import { Module } from "@nestjs/common"
import { User, UserSchema } from "./schemas/user.schema"
import { UserController } from "./user.controller"
import { UsersService } from "./user.service"
import { UserRepository } from "./user.repository"
import { JwtService } from "@nestjs/jwt"

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UsersService, UserRepository, JwtService, TokenService],
  exports: [UsersService, UserRepository],
})
export class UserModule {}
