import { Body, Controller, FileTypeValidator, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseFilePipe, Patch, Post, Put, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRoles } from 'src/enums/Roles.enum';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorMessages } from 'src/constants/constants';
import { UserAvatarRequestBody } from 'src/constants/constants';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { ObjectIdValidationPipe } from 'src/pipes/object-id-validation.pipe';
import { UserDto } from 'src/dto/user/newUser.dto';
import { UserUpdateDto } from 'src/dto/user/existingUser.dto';


@ApiTags("User")
@Controller('user')
export class UserController {
  constructor (
    private userService : UserService
  ) {}

  @ApiBearerAuth()
  // @Roles([UserRoles.Admin])
  // @UseGuards(JwtGuard, RoleGuard)
  @ApiBody({type : UserDto})
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns the created User',
    type: UserDto,
  })
  @Post()
  async createUser (
      @Body() userDto : UserDto
  ) {
      return await this.userService.createUser(userDto)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary : 'Get all User/Admin '})
  @ApiResponse({ status  : HttpStatus.OK, description : 'Return all User\s/Admin\s '})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: ErrorMessages.notFound })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: ErrorMessages.invalidCredentials })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: ErrorMessages.invalidCredentials })
  @HttpCode(HttpStatus.OK)
  // @Roles([UserRoles.Admin])
  // @UseGuards(JwtGuard, RoleGuard)
  @Get()
  async getUsers (
  )  {
    return await this.userService.getAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary : 'Update User info '})
  @ApiBody({ type : UserUpdateDto })
  @ApiResponse({ status : HttpStatus.OK, description : 'Return updateed User', type : UserDto})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User not found" })
  // @Roles([UserRoles.Admin])
  // @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':userId')
  async updateUserData (
    @Param('userId', ObjectIdValidationPipe) userId : string,
    @Body() userDto : UserUpdateDto
  ) {
    return this.userService.updateUser(userId, userDto);
  }
}