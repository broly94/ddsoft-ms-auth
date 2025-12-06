import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Define qué archivo .env cargar basado en NODE_ENV
const ENV = process.env.NODE_ENV;
console.log(ENV);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);
console.log(process.env.DB_NAME);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env.development' : `.env.${ENV}`,
      isGlobal: true, // Hace que las variables de entorno estén disponibles en toda la aplicación
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST, // e.g., 'db_auth' o 'db_ventas' del compose
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Busca tus archivos de entidad
      synchronize: true, // ¡ATENCIÓN! Usar solo en desarrollo, nunca en producción
      autoLoadEntities: true, // Carga automáticamente las entidades encontradas
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
