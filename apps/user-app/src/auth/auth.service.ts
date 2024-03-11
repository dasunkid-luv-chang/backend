import { Injectable, UnauthorizedException } from "@nestjs/common"
import { UsersService } from "../user/user.service"
import { SignInDto } from "./dto/signin.dto"
import { compare, compareSync } from "bcrypt"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signin(dto: SignInDto) {
    const user = await this.validateUser(dto)
    const accessToken = await this.signToken(user, "access")
    const refreshToken = await this.signToken(user, "refresh")

    return { user, accessToken, refreshToken }
  }

  async validateUser(dto: SignInDto) {
    const user = await this.userService.findByEmail(dto.email)

    if (!user) {
      throw new UnauthorizedException("Email is incorrect")
    }

    const isPasswordMatched = await compare(dto.password, user.password)
    if (!isPasswordMatched) {
      throw new UnauthorizedException("Password is incorrect")
    }

    return user
  }

  async refreshToken(user: any) {
    const accessToken = await this.signToken(user, "access")
    const refreshToken = await this.signToken(user, "refresh")
    return { accessToken, refreshToken }
  }

  async signToken(user: any, type: "access" | "refresh" = "access") {
    const payload = {
      email: user.email,
      sub: user._id,
    }

    if (type === "refresh") {
      return this.jwtService.signAsync(payload, {
        expiresIn: "7d",
        secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
      })
    }

    return this.jwtService.signAsync(payload, {
      expiresIn: "1h",
      secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
    })
  }
}
