import { Body, Controller, HttpCode, Post, Request, Res, Response, UseGuards } from "@nestjs/common"
import { SignUpDto } from "./dto/signup.dto"
import { SignInDto } from "./dto/signin.dto"
import { AuthService } from "./auth.service"
import { RefreshGuard } from "./guards/refresh.guard"
import { ChangePasswordDto } from "./dto/change-password.dto"
import { JwtGuard } from "./guards/jwt.guard"
import { ForgotPasswordDto } from "./dto/forgot-password.dto"

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto)
  }

  @Post("signin")
  @HttpCode(200)
  async signin(@Body() dto: SignInDto) {
    return this.authService.signin(dto)
  }

  @Post("forgot-password")
  @HttpCode(200)
  async forgotPassword(@Body() dto: ForgotPasswordDto, @Res() res) {
    return this.authService.forgotPassword(dto.email, res)
  }

  @Post("reset-password")
  @HttpCode(200)
  async resetPassword(
    @Body("token") token: string,
    @Body("password") password: string,
    @Res() res,
  ) {
    return this.authService.resetPassword(token, password, res)
  }

  @Post("change-password")
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async changePassword(@Body() dto: ChangePasswordDto, @Request() req) {
    return this.authService.changePassword(dto, req.user.id)
  }

  @Post("activate")
  @HttpCode(200)
  async activate(@Body("token") token: string, @Response() res) {
    return this.authService.activate(token, res)
  }

  @Post("resend-activation-email")
  @HttpCode(200)
  async resendActivateToken(@Body("email") token: string, @Response() res) {
    return this.authService.resendActivationEmail(token, res)
  }

  @Post("refresh")
  @UseGuards(RefreshGuard)
  @HttpCode(200)
  async refresh(@Request() req) {
    console.log("🚀 ~ AuthController ~ refresh ~ req:", req.user)
    return this.authService.refreshToken(req.user)
  }
}
