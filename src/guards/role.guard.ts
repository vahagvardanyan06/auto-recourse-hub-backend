import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { log } from 'console';
import { Roles } from 'src/decorators/role.decorator';
import { UserRoles } from 'src/enums/Roles.enum';
import { UserService } from 'src/users/users.service';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
      private reflector: Reflector,
      private  readonly userService : UserService
      ) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
   
    const requiredRoles = this.reflector.get(Roles, context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    
    const request = context.switchToHttp().getRequest();
    const user = await this.userService.findById(request['user'].id)
    if (!user) {
      return false;
    }
    const userRoles = user.roles;
    
    if (!userRoles || !userRoles.length) {
      console.log('insdie a role guard');
      
        return false; 
    }
    
   return  userRoles.some((role : UserRoles) => requiredRoles.includes(role));
};
}