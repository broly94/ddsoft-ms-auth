import { ValidationPipe, ValidationError, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export class RpcValidationPipe extends ValidationPipe {
  constructor() {
    super({
      // Habilita detailed errors if needed
      disableErrorMessages: false,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        // Formatea los errores en una estructura más plana y legible
        const errors = validationErrors.map((error) => ({
          property: error.property,
          messages: Object.values(error.constraints || {}).join(', '),
        }));

        // Lanza un RpcException con un status HTTP 400 y los errores detallados
        throw new RpcException({
          statusCode: HttpStatus.BAD_REQUEST, // <-- Usamos un código numérico HTTP estándar
          message: 'Error de validación en los datos de entrada.',
          details: errors, // <-- Incluimos los mensajes detallados del DTO
        });
      },
    });
  }
}
