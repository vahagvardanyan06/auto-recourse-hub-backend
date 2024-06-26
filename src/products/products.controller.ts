import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Query, UploadedFiles, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags} from '@nestjs/swagger';
import { AllExceptionsFilter } from '../filter/all.exception.filter';
import { ProductsService } from './products.service';
import { ProductDto } from '../dto/product/product.dto';
import { Roles } from '../decorators/role.decorator';
import { UserRoles } from '../enums/Roles.enum';
import { JwtGuard } from '../guards/jwt.guard';
import { RoleGuard } from '../guards/role.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateProductDto } from '../dto/product/updateProduct.dto';
import { ObjectIdValidationPipe } from '../pipes/object-id-validation.pipe';
import { IResponse } from 'src/interfaces/response.interface';
@UseFilters(AllExceptionsFilter)
@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor (private readonly productService : ProductsService) {}


  @ApiOperation({ summary : 'Search Product'})
  @ApiResponse({ status : HttpStatus.OK, description : "Return a founded product", type : [ProductDto] })
  @ApiQuery({ name: 'productName', description: 'Name of the product to search', example: 'Product name', type: String })
  @Get("/search")
  searchProduct (
      @Query('productName') searchText : string
  ) {
    return this.productService.searchProduct(searchText);
  }

  @ApiBearerAuth('auto-recourse-hub')
  @ApiOperation({ summary : 'Create Product'})
  @ApiBody({ type : ProductDto })
  @ApiResponse({ status : HttpStatus.CREATED, description : 'Create a Product', type : ProductDto })
  @Roles([UserRoles.Admin])
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FilesInterceptor('images', 12))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct (
    @UploadedFiles() images:  Array<Express.Multer.File>,
    @Body() productDto: ProductDto
  ) : Promise<IResponse> {
    return this.productService.create(images,productDto)
  }

  
  @ApiOperation({ summary : 'Get all Products'})
  @ApiResponse({ status : HttpStatus.OK, description : 'Return all products if products not found return []'})
  @ApiResponse({ type : [ProductDto] || ProductDto })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllProducts (
    @Query('page') page: number, @Query('limit') limit: number
  ) : Promise<any> {
    return await this.productService.getAllProducts(page, limit);;
  }

  @ApiOperation({ summary : 'Return top sale products'})
  @ApiResponse({ status : HttpStatus.OK , description : 'Return top sale products if exists', type: [ProductDto]  })
  @HttpCode(HttpStatus.OK)
  @Get('top_sale')
  getTopSaleProducts () {
    return this.productService.topSaleProducts();
  }

  @ApiOperation({ summary : 'Get By Id'})
  @ApiResponse({ status : HttpStatus.OK, description : 'Return a Single Product with specified id', type : ProductDto })
  @ApiResponse({ status : HttpStatus.NOT_FOUND, description : 'Return Not found when product with provided id doesnt exist' })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getSingleProduct (
    @Param('id', ObjectIdValidationPipe) productId : string,
  ) : Promise<ProductDto | NotFoundException>{

    return await this.productService.getById(productId);
  }

  @ApiBearerAuth('auto-recourse-hub')
  @ApiOperation({ summary : 'Delete Product'})
  @ApiResponse({ status : HttpStatus.OK, description : 'Delete product with provided id' })
  @ApiResponse({ status : HttpStatus.NOT_FOUND, description : 'Return Not found when product with provided id doesnt exist'  })
  @HttpCode(HttpStatus.OK)
  @Roles([UserRoles.Admin])
  @UseGuards(JwtGuard, RoleGuard)
  @Delete(':id')
  deleteProduct (
    @Param('id') productId : string,
  ) {
    return this.productService.deleteProduct(productId);
  }

  @ApiBearerAuth('auto-recourse-hub')
  @ApiOperation({ summary : 'Update Product' })
  @ApiResponse({ status : HttpStatus.OK, description : 'Update a Product with provided id', type : ProductDto })
  @ApiResponse({ status : HttpStatus.NOT_FOUND, description : 'Return Not found when product with provided id doesnt exist'  })
  @HttpCode(HttpStatus.OK)
  @Roles([UserRoles.Admin])
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @Patch(':id')
  updateProduct (
    @Param('id', ObjectIdValidationPipe) productId : string,
    @Body() updateDto : UpdateProductDto, 
    @UploadedFiles() images?:  Array<Express.Multer.File>,
  ) {
    return this.productService.updateProduct(productId, updateDto, images);
  }


}