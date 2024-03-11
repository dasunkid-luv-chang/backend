import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common"
import { CreateUserDto } from "./dto/create-user.dto"
import { UsersService } from "./user.service"
import { CreatedUserOuput } from "./types/create-user.ouput"
import { JwtGuard } from "../auth/guards/jwt.guard"

@Controller("users")
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<CreatedUserOuput> {
    return this.userService.create(dto)
  }

  @Get(":id")
  @UseGuards(JwtGuard)
  async getUserProfile(@Param("id") id: string) {
    return this.userService.findById(id)
  }
}
