import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshJwtGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenfromHeader(request);

        if (!token) throw new UnauthorizedException();

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.jwtRefreshToken,
            });
            request['user'] = payload;
        } catch (err) {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractTokenfromHeader(request: Request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Refresh' ? token : undefined;
    }
}
