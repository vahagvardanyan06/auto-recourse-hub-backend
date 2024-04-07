import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { LoginDto } from '../dto/user/login.dto';

@Injectable()
export class AuthService {
    constructor (
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}
    async validateUser (email : string, password : string) : Promise<User> {
        const user = await this.userService.findByEmail(email);    
        if (!user) {
            return null;
        }
        if (password !== user.password) {
            return null;
        }
        return user;
    }

     async login (loginDto : LoginDto) : Promise<{ token: string; }>  {
        const { email } = loginDto;
        const existingUser = await this.userService.findByEmail(email);
        const token =  this.jwtService.sign({ id : existingUser._id }, { secret : process.env.SECRET_KEY });
        return { token : token };
    }
}
