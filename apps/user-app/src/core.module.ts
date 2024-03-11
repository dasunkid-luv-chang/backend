import { LoggerModule } from "@app/common"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { UserModule } from "./user/user.module"
import { AuthModule } from "./auth/auth.module"

@Module({
  imports: [LoggerModule, ConfigModule.forRoot({ isGlobal: true }), UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class CoreModule {}
