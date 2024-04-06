import { Body, Controller, Delete, FileTypeValidator, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseFilePipe, Patch, Post, Put, Query, Req, Res, UploadedFile, UploadedFiles, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/filter/all.exception.filter';
import { ProductsService } from './products.service';
import { ProductDto } from 'src/dto/product/product.dto';
import { Roles } from 'src/decorators/role.decorator';
import { UserRoles } from 'src/enums/Roles.enum';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { UpdateProductDto } from 'src/dto/product/updateProduct.dto';
import { ObjectIdValidationPipe } from 'src/pipes/object-id-validation.pipe';
@UseFilters(AllExceptionsFilter)
@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor (private readonly productService : ProductsService,
    ) {}

  @ApiOperation({ summary : 'Create Product'})
  @ApiBody({ type : ProductDto })
  @ApiResponse({ status : HttpStatus.CREATED, description : 'Create a Product', type : ProductDto })
  @HttpCode(HttpStatus.CREATED)
  @Roles([UserRoles.Admin])
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FilesInterceptor('images', 12))
  @Post()
  async createProduct (
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    ) images:  Array<Express.Multer.File>,
    @Body() productDto: ProductDto
  ) : Promise<ProductDto>{
    return await this.productService.create(images,productDto)
  }

  
  @ApiOperation({ summary : 'Get all Prouducts'})
  @ApiResponse({ status : HttpStatus.OK, description : 'Return all products if products not found return []'})
  @ApiResponse({ type : [ProductDto] || ProductDto || null })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllProducts (
    @Query('page') page: number, @Query('limit') limit: number
  ) : Promise<any> {
    return await this.productService.getAllProducts(page, limit);;
  }

  @ApiOperation({ summary : 'Return top saled products'})
  @ApiResponse({ type : [ProductDto] || ProductDto || null })
  @ApiResponse({ status : HttpStatus.OK , description : 'Return top saled prodcuts if exists' })
  @HttpCode(HttpStatus.OK)
  @Get('top_sale')
  getTopSaleProducts () {
    return this.productService.topSaleProducts();
  }

  @ApiOperation({ summary : 'Get By Id'})
  @ApiResponse({ status : HttpStatus.OK, description : 'Return a Single Product with specified id' })
  @ApiResponse({ status : HttpStatus.NOT_FOUND, description : 'Return Not found when product with provided id doesnt exist' })
  @ApiResponse({ type : ProductDto })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getSingleProduct (
    @Param('id', ObjectIdValidationPipe) productId : string,
  ) : Promise<ProductDto | NotFoundException>{

    return await this.productService.getById(productId);
  }

  @ApiBearerAuth() 
  @ApiOperation({ summary : 'Delete Product'})
  @ApiResponse({ status : HttpStatus.OK, description : 'Delete product with provied id' })
  @ApiResponse({ status : HttpStatus.NOT_FOUND, description : 'Return Not found when product with provided id doesnt exist'  })
  @HttpCode(HttpStatus.OK)
  @Roles([UserRoles.Admin])
  @UseGuards(JwtGuard, RoleGuard)
  @Delete(':id')
  async deleteProduct (
    @Param('id') productId : string,
  ) {
    return await this.productService.deleteProduct(productId);
  }

  @ApiBearerAuth() 
  @ApiOperation({ summary : 'Update Product' })
  @ApiResponse({ status : HttpStatus.OK, description : 'Update a Product with provied id', type : ProductDto })
  @ApiResponse({ status : HttpStatus.NOT_FOUND, description : 'Return Not found when product with provided id doesnt exist'  })
  @HttpCode(HttpStatus.OK)
  @Roles([UserRoles.Admin])
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @Patch(':id')
  async updateProduct (
    @Param('id', ObjectIdValidationPipe) productId : string,
    @Body() updateDto : UpdateProductDto, 
    @UploadedFiles() images?:  Array<Express.Multer.File>,
  ) {
    return await this.productService.updateProduct(productId, updateDto, images);
  }
}