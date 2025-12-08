import { IsNotEmpty, IsNumber } from 'class-validator';

// DTO usado para comandos que solo necesitan un ID (Ej: Deshabilitar, Eliminar)
export class UserIdDto {
  @IsNotEmpty()
  @IsNumber({}, { message: 'El ID debe ser un número válido.' })
  id: number;
}
