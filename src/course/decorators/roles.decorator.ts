import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLE_KEYS = 'roles';

export const Roles = (...roles: Role[]) => SetMetadata(ROLE_KEYS, roles);
