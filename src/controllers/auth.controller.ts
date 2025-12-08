import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@/entities/user.entity';
import { AuthService } from '@/services/auth.service';
import { UserService } from '@/services/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly auth: AuthService,
    private readonly userService: UserService,
  ) {}

  @MessagePattern({ cmd: 'register' })
  async register(data: any): Promise<any> {
    const result = await this.userService.createUser(data);
    return result;
  }

  @MessagePattern({ cmd: 'login' })
  login(data: any): any {
    console.log('--- MENSAJE RECIBIDO DEL GATEWAY v0 ---');
    console.log('Datos de login recibidos:', data);

    // --- ¡ATENCIÓN! ---
    // Esta es una implementación de ejemplo. En un caso real, deberías
    // validar las credenciales del usuario (data.email y data.password)
    // contra la base de datos antes de generar un token.

    // Payload de ejemplo, asumiendo que 'data' contiene el email y el id del usuario.
    const payload = {
      sub: data.id || 1, // Usar el ID de usuario real de la base de datos
      email: data.email || 'user@example.com',
      role: UserRole.USER, // Asignar el rol correspondiente
    };

    const token = this.jwtService.sign(payload);

    return {
      status: 'ok',
      token: token,
      message: 'Conexión Exitosa: Gateway a Auth Real',
    };
  }
}
