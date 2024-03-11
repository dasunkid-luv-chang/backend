import { UserDocument } from "../../user/schemas/user.schema"

export type SignUpUserOutput = Omit<UserDocument, "password">
