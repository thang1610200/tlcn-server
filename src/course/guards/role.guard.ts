import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";
import { ROLE_KEYS } from "../decorators/roles.decorator";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requireRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEYS, [
            context.getHandler(), // get Value của role của function trong export class
            context.getClass(), // get Value của role của export class
        ]); //getAllAndOverride sẽ ghi đè nếu 1 trong 2 giá trị trên có

        const request = context.switchToHttp().getRequest();
        const user = request['user'];

        if(requireRoles[0] !== user.role) throw new UnauthorizedException("You are not authorized");

        return true;
    }
}