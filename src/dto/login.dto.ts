import { IsEmail, IsString } from 'class-validator';

// DTO para el login
export class LoginDto {
  @IsEmail({}, { message: 'El email debe ser una dirección de correo válida.' })
  email: string;

  @IsString({ message: 'La contraseña es requerida.' })
  password: string;
}
