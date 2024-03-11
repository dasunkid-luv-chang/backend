import { DynamicModule, Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { ModelDefinition, MongooseModule } from "@nestjs/mongoose"

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  static forFeature(models: ModelDefinition[]): DynamicModule {
    return MongooseModule.forFeature(models)
  }
}
