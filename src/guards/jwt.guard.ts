import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Injectable()
export class JwtGuard  {
    constructor (
        private jwtService : JwtService, 
        private configService : ConfigService
    ) {}

    async canActivate(context: ExecutionContext) : Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractToken(request);
        
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const paylaod = await this.jwtService.verifyAsync(
                token, 
                {
                    secret : this.configService.get<string>('SECRET_KEY'),
                }
            );
            request['user'] = paylaod;
            return true
        } catch (err) {
            throw new UnauthorizedException();
        }
        
    }

    private extractToken(request : Request) : string | undefined {
        const [type, token] = request.headers.authorization?.split(' ')?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
