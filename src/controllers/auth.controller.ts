import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  @MessagePattern({ cmd: 'login' })
  login(data: any): any {
    console.log('--- MENSAJE RECIBIDO DEL GATEWAY ---');
    console.log('Datos de login recibidos:', data);
    return {
      status: 'ok',
      token: 'MOCK_JWT_TOKEN_12345',
      message: 'Conexión Exitosa: Gateway a Auth Mock',
    };
  }
}
