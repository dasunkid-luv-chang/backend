import { BadRequestException, Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { UsersService } from "../user/user.service"
import { SignInDto } from "./dto/signin.dto"
import { compare } from "bcrypt"
import { ConfigService } from "@nestjs/config"
import { ChangePasswordDto } from "./dto/change-password.dto"
import { SignUpDto } from "./dto/signup.dto"
import { ClientProxy } from "@nestjs/microservices"
import { lastValueFrom } from "rxjs"
import { MAIL_SERVICE } from "./constants/service"
import { Response } from "express"
import { TokenService } from "@app/common"
import { UserRepository } from "../user/user.repository"

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    @Inject(MAIL_SERVICE) private readonly mailClient: ClientProxy,
  ) {}

  async signup(dto: SignUpDto) {
    const createdUser = await this.userService.create(dto)
    const { _id, email, fullname } = createdUser

    const payload = {
      email,
      id: _id,
    }

    const userInfo = { fullname }
    await this.sendActivationEmail(email, payload, userInfo)

    return createdUser
  }

  async signin(dto: SignInDto) {
    const user = await this.validateUser(dto)

    const payload = {
      email: user.email,
      id: user._id,
    }

    const accessToken = await this.tokenService.generateToken(payload, "access")
    const refreshToken = await this.tokenService.generateToken(payload, "refresh")

    return { user, accessToken, refreshToken }
  }

  async activate(token: string, res: Response) {
    let payload = null
    try {
      payload = await this.tokenService.verifyToken(token, "activation")
    } catch (error) {
      console.log("🚀 ~ AuthService ~ activate ~ error:", error)
      throw new BadRequestException("Invalid token")
    }

    const { id } = payload
    const user = await this.userRepository.findById(id, { status: 1 })

    if (user.status === 1) {
      throw new BadRequestException("User already activated")
    } else if (user.status === 2) {
      throw new BadRequestException("User already deactivated")
    }

    // activate user
    user.status = 1
    await user.save()
    res.status(200).send({ message: "User activated successfully", success: true })
  }

  async resendActivationEmail(email: string, res: Response) {
    const user = await this.userService.findByEmail(email)

    if (!user) {
      throw new BadRequestException("User not found")
    }

    if (user.status === 1) {
      throw new BadRequestException("User already activated")
    } else if (user.status === 2) {
      throw new BadRequestException("User already deactivated")
    }

    const { _id, fullname } = user
    const payload = {
      email,
      id: _id,
    }

    const userInfo = { fullname }

    await this.sendActivationEmail(email, payload, userInfo)

    // send success response
    res.status(200).send({ message: "Activation email sent successfully", success: true })
  }

  async changePassword(dto: ChangePasswordDto, id: string) {
    if (dto.currentPassword === dto.newPassword) {
      throw new UnauthorizedException("New password must be different from current password")
    }

    const user = await this.userRepository.findById(id)

    const isPasswordMatched = await compare(dto.currentPassword, user.password)
    if (!isPasswordMatched) {
      throw new UnauthorizedException("Current password is incorrect")
    }

    // update new password, no need to hash because mongoose middleware will do it automatically
    user.password = dto.newPassword
    await user.save()

    return this.refreshToken(user)
  }

  async forgotPassword(email: string, res: Response) {
    const user = await this.userService.findByEmail(email)

    if (!user) {
      throw new BadRequestException("User not exists with this email")
    }

    const payload = {
      email: user.email,
      id: user._id,
    }

    await this.sendForgotPasswordEmail(user.email, payload)

    res.status(200).send({ message: "Forgot password email sent successfully", success: true })
  }

  async resetPassword(token: string, candidatePassword: string, res: Response) {
    let payload = null
    try {
      payload = await this.tokenService.verifyToken(token, "forgot")
    } catch (error) {
      console.log("🚀 ~ AuthService ~ resetPassword ~ error:", error)
      throw new BadRequestException("Invalid token")
    }

    const { id } = payload
    const user = await this.userRepository.findById(id)

    if (user.status === 0) {
      throw new BadRequestException("User not activated, can not change password")
    } else if (user.status === 2) {
      throw new BadRequestException("User already deactivated, can not change password")
    }

    // save new password
    user.password = candidatePassword
    await user.save()
    res.status(200).send({ message: "Password changed successfully", success: true })
  }

  async validateUser(dto: SignInDto) {
    const user = await this.userRepository.findOne({ email: dto.email }, null, { lean: true })

    if (!user) {
      throw new BadRequestException("User not found with this email")
    }

    if (user.status === 0) {
      throw new UnauthorizedException("User is not activated")
    }

    if (user.status === 2) {
      throw new UnauthorizedException("User is deactivated")
    }

    const isPasswordMatched = await compare(dto.password, user.password)
    if (!isPasswordMatched) {
      throw new UnauthorizedException("Password is incorrect")
    }

    const { password, ...rest } = user

    return rest
  }

  async refreshToken(user: any) {
    const payload = {
      email: user.email,
      id: user._id,
    }
    const accessToken = await this.tokenService.generateToken(payload, "access")
    const refreshToken = await this.tokenService.generateToken(payload, "refresh")
    return { accessToken, refreshToken }
  }

  async sendActivationEmail(email: string, payload: any, userInfo: any) {
    const activationToken = await this.tokenService.generateToken(payload, "activation")
    console.log("🚀 ~ AuthService ~ signup ~ activationToken:", activationToken)
    const url =
      this.configService.get<string>("FRONTEND_URL") + "/auth/activate?token=" + activationToken

    // send activation email
    await lastValueFrom(
      this.mailClient.emit("send_activation_email", {
        url,
        email,
        ...userInfo,
      }),
    )
  }

  async sendForgotPasswordEmail(email: string, payload: any) {
    const forgotPasswordToken = await this.tokenService.generateToken(payload, "forgot")
    console.log(
      "🚀 ~ AuthService ~ sendForgotPasswordEmail ~ forgotPasswordToken:",
      forgotPasswordToken,
    )
    const url =
      this.configService.get<string>("FRONTEND_URL") +
      "/auth/reset-password?token=" +
      forgotPasswordToken

    // send forgot password email
    await lastValueFrom(
      this.mailClient.emit("send_forgot_password_email", {
        url,
        email,
      }),
    )
  }
}
