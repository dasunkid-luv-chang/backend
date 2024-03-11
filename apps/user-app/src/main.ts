import { NestFactory } from "@nestjs/core"
import { CoreModule } from "./core.module"
import { ValidationPipe } from "@nestjs/common"
import { Logger } from "nestjs-pino"
import { ConfigService } from "@nestjs/config"

async function bootstrap() {
  const app = await NestFactory.create(CoreModule)
  app.setGlobalPrefix("api/v1")
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, stopAtFirstError: true }))
  app.useLogger(app.get(Logger))
  const configService = app.get(ConfigService)
  await app.listen(configService.get<string>("PORT"))
}
bootstrap()
