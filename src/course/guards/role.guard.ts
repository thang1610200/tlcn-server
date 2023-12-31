import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLE_KEYS } from '../decorators/roles.decorator';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly prismaService: PrismaService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requireRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLE_KEYS,
            [
                context.getHandler(), // get Value của role của function trong export class
                context.getClass(), // get Value của role của export class
            ],
        ); //getAllAndOverride sẽ ghi đè nếu 1 trong 2 giá trị trên có

        const request = context.switchToHttp().getRequest();
        const user = request['user'];

        const auth = await this.prismaService.user.findUnique({
            where: {
                email: user.email,
            },
        });

        //if(requireRoles[0] !== auth.role) throw new UnauthorizedException("You are not authorized");

        if (
            auth.role === 'INSTRUCTOR' &&
            (requireRoles[0] === 'INSTRUCTOR' || requireRoles[0] === 'LEARNER')
        ) {
            return true;
        } else if (auth.role === 'LEARNER' && requireRoles[0] === 'LEARNER') {
            return true;
        } else if (auth.role === 'ADMIN' && requireRoles[0] === 'ADMIN') {
            return true;
        }

        throw new UnauthorizedException('You are not authorized');
        //return false;
    }
}
