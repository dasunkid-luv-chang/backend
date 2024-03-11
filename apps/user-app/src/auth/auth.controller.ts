import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common"
import { SignUpDto } from "./dto/signup.dto"
import { UsersService } from "../user/user.service"
import { SignUpUserOutput } from "./types/signup-user.output"
import { SignInDto } from "./dto/signin.dto"
import { AuthService } from "./auth.service"
import { RefreshGuard } from "./guards/refresh.guard"

@Controller("auth")
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post("signup")
  async signup(@Body() dto: SignUpDto): Promise<SignUpUserOutput> {
    return this.userService.create(dto)
  }

  @Post("signin")
  async signin(@Body() dto: SignInDto): Promise<any> {
    return this.authService.signin(dto)
  }

  @Post("refresh")
  @UseGuards(RefreshGuard)
  async refresh(@Request() req) {
    console.log("🚀 ~ AuthController ~ refresh ~ req:", req.user)
    return this.authService.refreshToken(req.user)
  }
}
