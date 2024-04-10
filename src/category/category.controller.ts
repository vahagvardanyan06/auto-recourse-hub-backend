import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseFilePipeBuilder, Patch, Post, UploadedFile, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from '../dto/category/category.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from '../filter/all.exception.filter';
import { JwtGuard } from '../guards/jwt.guard';
import { RoleGuard } from '../guards/role.guard';
import { ObjectIdValidationPipe } from '../pipes/object-id-validation.pipe';
import { CategoryUpdateDto } from '../dto/category/categoryUpdateDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../decorators/role.decorator';
import { UserRoles } from '../enums/Roles.enum';
import { IsNotEmpty } from 'class-validator';

@UseFilters(AllExceptionsFilter)
@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor (
    private categoryService : CategoryService
  ) {}

  @ApiBearerAuth('auto-recourse-hub') 
  @ApiOperation({ summary : "Create Category"})
  @ApiBody({ type : CategoryDto })
  @ApiResponse({ status : HttpStatus.CREATED, description : 'Create a Category', type : CategoryDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation failed' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized'})
  @HttpCode(HttpStatus.CREATED)
  @Roles([UserRoles.Admin])
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('logo'))
  @Post()
  createCategory (
    @UploadedFile(
      new ParseFilePipeBuilder()
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      }),
    )  logo:  Express.Multer.File,
    @Body() categoryDto : CategoryDto,
  ) {
    return this.categoryService.createCategory(categoryDto, logo); 
  }

  @ApiOperation({ summary : "Get category with name"})
  @ApiResponse({ status : HttpStatus.OK, description : "Return category with name", type : CategoryDto })
  @ApiResponse({ status : HttpStatus.NOT_FOUND, description : 'Return not found if category nor found'})
  @ApiParam({ name: 'name', description: 'Category name', type: 'string' })
  @Get('name/:name')
  getCategoryWithName (
    @Param('name') categoryName : string,
  ) {
    return this.categoryService.getCategoryWithName(categoryName);
  }

  @ApiOperation({ summary : "Get all Categories" })
  @ApiResponse({ status : HttpStatus.OK, description : 'Return all Categories if products not found return []', type :  [CategoryDto] || CategoryDto || Array<[]>  })
  @HttpCode(HttpStatus.OK)
  @Get()
  getAllCategories () {
    return this.categoryService.getAllCategories();
  }

  @ApiOperation({ summary : 'Get By Id'})
  @ApiResponse({ status : HttpStatus.OK, description : 'Return a Single Product with specified id' })
  @ApiResponse({ status : HttpStatus.NOT_FOUND, description : 'Return Not found when product with provided id doesnt exist' })
  @ApiResponse({ type : CategoryDto })
  @Get(':id')
  getCategoryWithId (
    @Param('id', ObjectIdValidationPipe) categoryId : string,
  )  {
    return this.categoryService.getCategoryById(categoryId);
  }

  @ApiBearerAuth('auto-recourse-hub') 
  @ApiOperation({ summary : "Update Category" })
  @ApiResponse({ status : HttpStatus.OK, description : 'Update a Product with provied id' })
  @ApiResponse({ status : HttpStatus.NOT_FOUND, description : 'Return Not found when product with provided id doesnt exist'  })
  @HttpCode(HttpStatus.OK)
  @Roles([UserRoles.Admin])
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('logo'))
  @Patch(':id') 
  updateCategory (
    @Param('id', ObjectIdValidationPipe) categoryId : string,
    @Body() updateDto : CategoryUpdateDto,
    @UploadedFile() logo?:  Express.Multer.File,
  ) {
      return this.categoryService.updateCategory(categoryId, updateDto,logo)
  }

  @ApiBearerAuth('auto-recourse-hub') 
  @ApiResponse({ description : 'Delete category with specifed id'})
  @ApiResponse({ status : HttpStatus.NOT_FOUND, description : 'Return Not found when product with provided id doesnt exist'})
  @Roles([UserRoles.Admin])
  @UseGuards(JwtGuard, RoleGuard)
  @Delete(':id')
  deleteCategory (
    @Param('id', ObjectIdValidationPipe) categoryId : string
  ) {
    return this.categoryService.deleteCategory(categoryId);
  }
  
}
