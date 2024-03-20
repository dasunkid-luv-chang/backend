import { Controller, Get, Param, UseGuards } from "@nestjs/common"
import { UsersService } from "./user.service"
import { JwtGuard } from "../auth/guards/jwt.guard"

@Controller("users")
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get(":id")
  @UseGuards(JwtGuard)
  async getUserProfile(@Param("id") id: string) {
    return this.userService.findById(id)
  }
}
