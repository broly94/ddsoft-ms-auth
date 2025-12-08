import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@/entities/user.entity';

export const ROLES_KEY = 'roles';
// Este decorador recibe una lista de roles permitidos
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
