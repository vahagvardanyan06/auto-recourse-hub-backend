import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from 'src/dto/category/category.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/filter/all.exception.filter';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { ObjectIdValidationPipe } from 'src/pipes/object-id-validation.pipe';
import { CategoryUpdateDto } from 'src/dto/category/categoryUpdateDto';

@UseFilters(AllExceptionsFilter)
@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor (
    private categoryService : CategoryService
  ) {}

  @ApiBearerAuth() 
  @ApiOperation({ summary : "Create Category"})
  @ApiBody({ type : CategoryDto })
  @ApiResponse({ status : HttpStatus.CREATED, description : 'Create a Product'})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation failed' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized'})
  @HttpCode(HttpStatus.CREATED)
  // @Roles([UserRoles.Admin])
  // @UseGuards(JwtGuard, RoleGuard)
  @Post()
  createCategory (
    @Body() categoryDto : CategoryDto
  ) {
    console.log(categoryDto.name);
    
    return this.categoryService.createCategory(categoryDto); 
  }

  @ApiOperation({ summary : "Get category with name"})
  @ApiResponse({ status : HttpStatus.OK, description : "Retun category with name", type : CategoryDto })
  @ApiResponse({ status : HttpStatus.NOT_FOUND, description : 'Return not found if catgeory nor found'})
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
    return this.categoryService.getAllCategories()
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

  // @ApiBearerAuth() 
  @ApiOperation({ summary : "Update Category" })
  @ApiResponse({ status : HttpStatus.OK, description : 'Update a Product with provied id' })
  @ApiResponse({ status : HttpStatus.NOT_FOUND, description : 'Return Not found when product with provided id doesnt exist'  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type : CategoryUpdateDto })
  // @Roles([UserRoles.Admin])
  // @UseGuards(JwtGuard, RoleGuard)
  @Patch(':id') 
  updateCategory (
    @Param('id', ObjectIdValidationPipe) categoryId : string,
    @Body() updateDto : CategoryUpdateDto
  ) {
      return this.categoryService.updateCategory(categoryId, updateDto)
  }


}
