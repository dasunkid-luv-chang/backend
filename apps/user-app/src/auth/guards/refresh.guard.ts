import { TokenService } from "@app/common"
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      const payload = await this.tokenService.verifyToken(token, "refresh")
      request.user = payload
    } catch (error) {
      throw new UnauthorizedException()
    }

    return true
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? []
    return type === "Refresh" ? token : undefined
  }
}
