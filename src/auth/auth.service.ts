import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/dto/user/newUser.dto';
import { UserService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from 'src/enums/Roles.enum';
import { User } from 'src/entities/user.entity';

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

     async login (email : string, password : string) : Promise<{ token: string; }>  {
        const existingUser = await this.userService.findByEmail(email);
        const token =  this.jwtService.sign({ id : existingUser._id }, { secret : process.env.SECRET_KEY });
        return { token : token };
    }
}
