import { UserRole } from '@/entities/user.entity';
import { IsBoolean, IsEmail, IsEnum, IsOptional } from 'class-validator';

// DTO para la actualización parcial de usuarios (solo datos administrativos)
export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'El email debe ser una dirección de correo válida.' })
  email?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol de usuario no es válido.' })
  role?: UserRole;

  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser un booleano.' })
  isActive?: boolean;
}
