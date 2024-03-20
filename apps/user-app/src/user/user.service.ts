import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import { UserRepository } from "./user.repository"
import { CreateUserDto } from "./dto/create-user.dto"

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: CreateUserDto) {
    const isUserExists = await this.isUserExists(dto.email)

    if (isUserExists) {
      throw new ConflictException("User already exists")
    }

    const createdUser = await this.userRepository.create(dto)
    const { password, ...rest } = createdUser.toObject()
    return rest
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id, { password: 0 })
    if (!user) {
      throw new NotFoundException("User not found")
    }
    return user
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ email }, { password: 0 }, { lean: true })
  }

  async isUserExists(email: string) {
    const user = await this.userRepository.findOne({ email }, { id: 1 }, { lean: true })
    return !!user
  }
}
