import { AbstractRepository } from "@app/common"
import { Injectable } from "@nestjs/common"
import { User, UserDocument } from "./schemas/user.schema"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
  constructor(@InjectModel(User.name) model: Model<UserDocument>) {
    super(model)
  }
}
