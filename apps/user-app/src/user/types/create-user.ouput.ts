import { UserDocument } from "../schemas/user.schema"

export type CreatedUserOuput = Omit<UserDocument, "password">
