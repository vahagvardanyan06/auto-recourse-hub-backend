import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local'
import { AuthService } from "../auth/auth.service";
import { ErrorMessages } from "../constants/constants";
import { Request } from 'express';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor (private authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
          });
    }

    async validate (req : Request , email : string, password : string) : Promise<any> {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new ForbiddenException(ErrorMessages.invalidCredentials);
        }
        req['user.roles'] = user.roles;
        return user;
    }
    
}