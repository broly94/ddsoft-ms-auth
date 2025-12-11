import { User } from '@/entities/user.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Verifica la validez de un token JWT.
   * @param token El token JWT a verificar.
   * @returns El payload decodificado del token si es válido.
   * @throws RpcException si el token es inválido o ha expirado.
   */
  async verifyToken(token: string) {
    try {
      // El método verifyAsync ya usa la clave secreta configurada en el JwtModule
      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (error) {
      // Si el token es inválido (firma incorrecta, expirado, etc.), JwtService lanza un error.
      throw new RpcException({
        message: 'Token no válido o expirado',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
  }

  /**
   * Valida las credenciales del usuario y genera un token JWT si son válidas.
   * @param email El correo electrónico del usuario.
   * @param password La contraseña del usuario.
   * @returns Un objeto con el token JWT y los datos del usuario.
   * @throws HttpException si las credenciales son inválidas.
   */
  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new RpcException({
        message: 'Credenciales inválidas',
        statusCode: HttpStatus.UNAUTHORIZED,
        details: null, // <-- Añadido
      });
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new RpcException({
        message: 'Credenciales inválidas',
        statusCode: HttpStatus.UNAUTHORIZED,
        details: null, // <-- Añadido
      });
    }

    // Si las credenciales son válidas, genera un token JWT
    const payload = { email: user.email, sub: user.id, role: user.role };

    // Generar el token JWT
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
