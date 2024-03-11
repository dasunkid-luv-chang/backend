import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator"

export class CreateUserDto {
  @IsNotEmpty()
  username: string

  @IsNotEmpty()
  fullname: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsStrongPassword()
  password: string
}
