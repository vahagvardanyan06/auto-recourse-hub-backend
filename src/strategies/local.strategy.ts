import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local'
import { AuthService } from "src/auth/auth.service";
import { ErrorMessages } from "src/constants/constants";
import { UserService } from "src/users/users.service";
import { Request } from 'express';
import { log } from 'console';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor (private authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
          });
    }

    async validate (req : Request , email : string, password : string) : Promise<any> {
        console.log("before LocalStrategy ");
        
        const user = await this.authService.validateUser(email, password);
        console.log(user, "isndie a Lcoal startegy");
        
        if (!user) {
            throw new NotFoundException(ErrorMessages.invalidCredentials);
        }
        req['user.roles'] = user.roles;
        return user;
    }
    
}