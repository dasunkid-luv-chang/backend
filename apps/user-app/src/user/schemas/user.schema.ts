import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { hashSync } from "bcrypt"
import { HydratedDocument } from "mongoose"

export type UserDocument = HydratedDocument<User>

export enum UserStatus {
  unverify, // 0
  verify, // 1
  banned, // 2
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string

  @Prop({ required: true })
  fullname: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop()
  github_profile: string

  @Prop()
  youtube_profile: string

  @Prop()
  website: string

  @Prop()
  location: string

  @Prop()
  work: string

  @Prop()
  profile_image: string

  @Prop({ default: UserStatus.unverify })
  status: UserStatus

  @Prop({ default: 0 })
  role: number
}

export const UserSchema = SchemaFactory.createForClass(User)

// Hash password before saving
UserSchema.pre<User>("save", async function (next) {
  const user = this as UserDocument

  if (user.isModified("password")) {
    user.password = hashSync(user.password, 10)
  }
  next()
})
