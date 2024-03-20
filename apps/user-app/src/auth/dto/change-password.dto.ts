import { IsNotEmpty, IsStrongPassword } from "class-validator"

export class ChangePasswordDto {
  @IsNotEmpty()
  currentPassword: string
  @IsNotEmpty()
  @IsStrongPassword()
  newPassword: string
}
