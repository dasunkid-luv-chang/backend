import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import { UserRepository } from "./user.repository"
import { CreateUserDto } from "./dto/create-user.dto"
import { UserDocument } from "./schemas/user.schema"
import { CreatedUserOuput } from "./types/create-user.ouput"

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: CreateUserDto) {
    const user = await this.userRepository.findOne({ email: dto.username })
    if (user) {
      throw new ConflictException("User already exists")
    }

    const createdUser = await this.userRepository.create(dto)
    return this.omitPassword(createdUser)
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ email })
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new NotFoundException("User not found")
    }

    return user
  }

  omitPassword(user: UserDocument): CreatedUserOuput {
    const { password, ...rest } = user.toObject()
    return rest as CreatedUserOuput
  }
}
