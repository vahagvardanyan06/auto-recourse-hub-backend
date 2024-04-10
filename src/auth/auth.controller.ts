import { Body, Controller, HttpCode, HttpStatus, Post, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LocalGuard } from '../guards/local.guard';
import { AuthService } from './auth.service';
import { AllExceptionsFilter } from '../filter/all.exception.filter';
import { ErrorMessages, Route } from '../constants/constants';
import { ApiBody, ApiOperation,ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/role.decorator';
import { UserRoles } from '../enums/Roles.enum';
import { LoginDto } from '../dto/user/login.dto';

@UseFilters(AllExceptionsFilter)
@Controller(Route.entry)
@ApiTags('Authentication')
export class AuthController {
    constructor (
        private readonly authService: AuthService
    ) {}
   
    @ApiOperation({ summary: 'Sign in' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: HttpStatus.OK, description: 'Returns a JWT token' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: ErrorMessages.invalidCredentials })
    @HttpCode(HttpStatus.OK)
    @Roles([UserRoles.Admin])
    @UseGuards(LocalGuard, RoleGuard)
    @UsePipes(new ValidationPipe({ forbidUnknownValues  : false}))
    @Post(Route.signIn)
    async signIn (
        @Body() loginDto : LoginDto,
    ) : Promise<{ token :  string }> {
         return await this.authService.login(loginDto); 
    }
}



