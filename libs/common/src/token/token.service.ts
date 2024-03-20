import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { TokenType, tokenExpireTimes, tokenSecrets } from "./token.constant"

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generateToken(payload: any, type: TokenType) {
    return this.jwtService.signAsync(payload, {
      expiresIn: tokenExpireTimes[type],
      secret: this.configService.get<string>(tokenSecrets[type]),
    })
  }

  verifyToken(token: string, type: TokenType) {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>(tokenSecrets[type]),
    })
  }
}
