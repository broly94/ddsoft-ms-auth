import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '@/entities/user.entity';

export class UpdateUserRequestDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsEmail({}, { message: 'El email debe ser una dirección de correo válida.' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol de usuario no es válido.' })
  role?: UserRole;

  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser un booleano.' })
  isActive?: boolean;
}
