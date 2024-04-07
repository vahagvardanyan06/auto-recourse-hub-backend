import { Body, Controller,Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { UserRoles } from '../enums/Roles.enum';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorMessages } from '../constants/constants';
import { JwtGuard } from '../guards/jwt.guard';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/role.decorator';
import { ObjectIdValidationPipe } from '../pipes/object-id-validation.pipe';
import { NewUserDto } from '../dto/user/new.user.dto';
import { UserUpdateDto } from '../dto/user/update.user.dto';
import { UserDto } from '../dto/user/existing.user.dto';


@ApiTags("User")
@Controller('user')
export class UserController {
  constructor (
    private userService : UserService
  ) {}

  @ApiBearerAuth('auto-recourse-hub')
  @Roles([UserRoles.Admin])
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBody({type : NewUserDto})
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns the created User',
    type: UserDto,
  })
  @Post()
  async createUser (
      @Body() userDto : NewUserDto
  ) {
      return await this.userService.createUser(userDto)
  }

  @ApiBearerAuth('auto-recourse-hub')
  @ApiOperation({ summary : 'Get all User/Admin '})
  @ApiResponse({ status  : HttpStatus.OK, description : 'Return all User\s/Admin\s ', type : [UserDto]})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: ErrorMessages.notFound })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
  @Roles([UserRoles.Admin])
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers (
  )  {
    return await this.userService.getAll();
  }

  @ApiBearerAuth('auto-recourse-hub')
  @ApiOperation({ summary : 'Update User info '})
  @ApiBody({ type : UserUpdateDto })
  @ApiResponse({ status : HttpStatus.OK, description : 'Return updateed User', type : UserDto})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User not found" })
  @Roles([UserRoles.Admin])
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':userId')
  async updateUserData (
    @Param('userId', ObjectIdValidationPipe) userId : string,
    @Body() userDto : UserUpdateDto
  ) {
    return this.userService.updateUser(userId, userDto);
  }
}