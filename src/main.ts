import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RpcValidationPipe } from '@/pipes/rpc-validation.pipe';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    },
  );

  app.useGlobalPipes(new RpcValidationPipe());

  await app.listen();
  console.log('Microservicio auth está escuchando mensajes de Redis...');
}
bootstrap();
