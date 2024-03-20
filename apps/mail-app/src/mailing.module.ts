import { Module } from "@nestjs/common"
import { MailingController } from "./mailing.controller"
import { MailingService } from "./mailing.service"
import { RmqModule } from "@app/common"
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [RmqModule, ConfigModule.forRoot({ isGlobal: true, envFilePath: "apps/mail-app/.env" })],
  controllers: [MailingController],
  providers: [MailingService],
})
export class MailingModule {}
