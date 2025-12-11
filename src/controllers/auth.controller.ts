import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from '@/services/auth.service';
import { UserService } from '@/services/user.service';
import { RegisterDto } from '@/dto/auth.dto';
import { UpdateUserRequestDto } from '@/dto/update-user-request.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @MessagePattern({ cmd: 'register' })
  async register(@Payload() data: RegisterDto) {
    console.log('Datos válidos recibidos:', data);
    return await this.userService.createUser(data);
  }

  @MessagePattern({ cmd: 'update' })
  update(@Payload() data: UpdateUserRequestDto) {
    const { id, ...rest } = data;
    return this.userService.updateUser(id, rest);
  }

  @MessagePattern({ cmd: 'login' })
  login(data: any): any {
    return this.authService.signIn(data.email, data.password);
  }

  @MessagePattern({ cmd: 'verify_token' })
  verifyToken(@Payload() data: { token: string }) {
    return this.authService.verifyToken(data.token);
  }

  @MessagePattern({ cmd: 'get-user' })
  getUser(@Payload() id: number) {
    return this.userService.findUser(id);
  }

  @MessagePattern({ cmd: 'get-users' })
  getUsers() {
    return this.userService.findUsers();
  }

  @MessagePattern({ cmd: 'soft-delete' })
  softDelete(@Payload() id: number) {
    return this.userService.softDeleteUser(id);
  }
}
