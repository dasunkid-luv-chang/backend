import { Controller } from "@nestjs/common"
import { MailingService } from "./mailing.service"
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices"

@Controller()
export class MailingController {
  constructor(private readonly mailingService: MailingService) {}

  @EventPattern("send_activation_email")
  async handleEvent(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMessage = context.getMessage()
    console.log("User created event received")
    console.log(data)
    await this.mailingService.sendMail("Welcome", "welcome", data)
    await channel.ack(originalMessage)
  }
}
