import { Body, Controller, HttpCode, HttpStatus, Post, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LocalGuard } from 'src/guards/local.guard';
import { AuthService } from './auth.service';
import { AllExceptionsFilter } from 'src/filter/all.exception.filter';
import { ErrorMessages, Route } from 'src/constants/constants';
import { ApiBody, ApiOperation,ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from '../decorators/role.decorator';
import { UserRoles } from 'src/enums/Roles.enum';
import { LoginDto } from 'src/dto/user/login.dto';

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
    async signin (
        @Body() loginDto : LoginDto,
    ) : Promise<{ token :  string }> {
         return await this.authService.login(loginDto); 
    }
}



