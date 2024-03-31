import { Body, ClassSerializerInterceptor, Controller, FileTypeValidator, Get, HttpCode, HttpStatus, Param, ParseFilePipe, Post, Req, Res, UploadedFile, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserDto } from 'src/dto/user/newUser.dto';
import { LocalGuard } from 'src/guards/local.guard';
import { UserService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { AllExceptionsFilter } from 'src/filter/all.exception.filter';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ErrorMessages, Route } from 'src/constants/constants';
import { ApiBody, ApiOperation, ApiParam, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
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
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: ErrorMessages.invalidCredentials })
    @HttpCode(HttpStatus.OK)
    @Roles([UserRoles.Admin])
    @UseGuards(LocalGuard, RoleGuard)
    @UsePipes(new ValidationPipe({ forbidUnknownValues  : false}))
    @Post(Route.signIn)
    async signin (
        @Body ('email') email : string,
        @Body('password') password : string,
        @Res ({ passthrough : true }) response : Response
    ) : Promise<{ token :  string }> {
         return await this.authService.login(email, password); 
    }
}



