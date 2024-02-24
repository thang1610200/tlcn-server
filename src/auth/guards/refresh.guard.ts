import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshJwtGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService,
                @InjectRedis() private readonly redis: Redis,
                private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenfromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.jwtRefreshToken,
            });

            const user = await this.authService.findbyEmail(payload.email);

            await this.redis.select(1);

            const getToken = await this.redis.get(user.id);

            if(token !== getToken){
                return false;
            }

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
