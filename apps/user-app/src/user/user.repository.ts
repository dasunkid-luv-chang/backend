import { AbstractRepository } from "@app/common"
import { Injectable, Logger } from "@nestjs/common"
import { User, UserDocument } from "./schemas/user.schema"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UserRepository.name)

  constructor(@InjectModel(User.name) model: Model<UserDocument>) {
    super(model)
  }
}
