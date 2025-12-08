import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '@/entities/user.entity';

// Definición de la estructura del Payload del JWT
export interface JwtPayload {
  sub: number; // User ID
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Especificamos dónde buscar el token (Encabezado 'Authorization: Bearer <token>')
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // La expiración del token debe ser verificada
      ignoreExpiration: false,
      // CLAVE SECRETA (Debe ser la misma que la usada en AuthModule)
      secretOrKey: 'SUPER_SECRETO_PARA_PROYECTO',
    });
  }

  /**
   * Este método se llama después de validar la firma del token.
   * Devuelve el payload del usuario que será inyectado en el request (req.user).
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const { exp } = payload;
    const now = new Date().getTime() / 1000;

    if (exp) {
      if (exp < now) {
        throw new UnauthorizedException('El token ha expirado');
      }
    }

    return payload;
  }
}
