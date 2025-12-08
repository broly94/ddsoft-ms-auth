import { RegisterDto } from '@/dto/auth.dto';
import { User } from '@/entities/user.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(data: RegisterDto): Promise<User> {
    try {
      const newUser = this.userRepository.create(data);
      return this.userRepository.save(newUser);
    } catch (error) {
      console.log('Error al crear el usuario:', error);
      throw new HttpException(
        `Error al crear el usuario...${error}`,
        error.status || 500,
      );
    }
  }
}
