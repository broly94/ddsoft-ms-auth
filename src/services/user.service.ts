import { UpdateUserDto } from '@/dto/update.dto';
import { User } from '@/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(data: any): Promise<any> {
    const newUser = this.userRepository.create(data);

    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new RpcException({
        message: 'El correo electrónico ya está en uso',
        statusCode: 400,
        details: null,
      });
    }

    return this.userRepository.save(newUser);
  }
  /**
   * Actualiza un usuario existente.
   * @param id El ID del usuario a actualizar.
   * @param data Los datos a actualizar del usuario.
   * @returns El usuario actualizado.
   * @throws RpcException si el usuario no se encuentra o si el email ya está en uso.
   */
  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new RpcException({
        message: 'Usuario no encontrado',
        statusCode: 404,
        details: null,
      });
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: data.email },
      });
      if (existingUser && existingUser.id !== id) {
        throw new RpcException({
          message: 'El correo electrónico ya está en uso por otro usuario',
          statusCode: 400,
          details: null,
        });
      }
    }

    this.userRepository.merge(user, data);
    return this.userRepository.save(user);
  }

  /**
   * Realiza un "soft delete" de un usuario, marcándolo como inactivo.
   * @param id El ID del usuario a deshabilitar.
   * @returns El usuario deshabilitado.
   * @throws RpcException si el usuario no se encuentra.
   */
  async softDeleteUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new RpcException({
        message: 'Usuario no encontrado',
        statusCode: 404,
        details: null,
      });
    }

    user.isActive = false;
    return this.userRepository.save(user);
  }

  /**
   * Busca un usuario por su ID.
   * @param id El ID del usuario a buscar.
   * @returns El usuario encontrado.
   * @throws RpcException si el usuario no se encuentra.
   */
  async findUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new RpcException({
        message: 'Usuario no encontrado',
        statusCode: 404,
        details: null,
      });
    }
    return user;
  }

  /**
   * Busca todos los usuarios.
   * @returns Una lista de todos los usuarios.
   */
  async findUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}
