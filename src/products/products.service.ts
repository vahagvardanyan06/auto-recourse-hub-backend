import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/entities/product.entity';
import { Model } from 'mongoose';
import { ProductDto } from 'src/dto/product/product.dto';
import { UserService } from 'src/users/users.service';
import { ErrorMessages } from 'src/constants/constants';
import { UpdateProductDto } from 'src/dto/product/updateProduct.dto';
import { Category } from 'src/entities/category.entity';
import { CategoryService } from 'src/category/category.service';
import { S3Service } from 'src/s3Service/s3.service';
import * as path from 'path'
import * as querystring from 'querystring';
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel : Model<Product>,
    private categoryService : CategoryService,
    private s3Service : S3Service,
  ) {}

  private parseBoolean(value: string): boolean {
    return value.toLowerCase() === 'true';
  }

  async create(images: Express.Multer.File[], productDto : ProductDto): Promise<ProductDto> {
    const { categoryId,  topSale, ...productData } = productDto;
    const category = await this.categoryService.findById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const product = await this.productModel.create({
      ...productData,
      topSale : this.parseBoolean(topSale) ? true : false,
      images: [], 
      categoryNameInfo : category.category_name,
      category_name : category.name
    });
    
    
    const uploadPromises = images.map(async (image) => {
      const encodedFileName = querystring.escape(path.basename(image.originalname));
      product.fileNames.push(encodedFileName);
      const s3Data = await this.s3Service.s3_upload(image.buffer, process.env.BUCKET_NAME, encodedFileName, image.mimetype);
      product.images.push(s3Data.Location);
    });
  
    await Promise.all(uploadPromises);
    category.products.push(product);
    await category.save()
    await product.save();
    return ProductDto.convertToDto(product);
  }


  async getById (productId : string) : Promise<ProductDto | any> {
    const product = await this.productModel.findById(productId)
    if (!product) {
      throw new NotFoundException(ErrorMessages.notFound)
    } 
     return ProductDto.convertToDto(product);
  }


  async deleteProduct (productId : string) {
  const product = await this.productModel.findById(productId);
  if (!product) {
    throw new NotFoundException(ErrorMessages.notFound);
  }
  await this.productModel.deleteOne({ _id : productId }) 
  if (product.images) {
    const deleteImagesPromises = product.images.map(async (each : string, index : number) => {
      console.log(product.fileNames[index]);
      console.log(each);

      await this.s3Service.deleteFIle(process.env.BUCKET_NAME, product.fileNames[index])
    })
    Promise.all(deleteImagesPromises);    
  }
  await this.categoryService.removeProductFromCategories(productId)
  return {
    message : 'success',
    status : HttpStatus.OK
  };
}

  async getAllProducts (page : number, limit : number) : Promise<any> {
      const count = await this.productModel.countDocuments({}).exec();
      const page_total = Math.floor((count - 1)/ limit) + 1;
      const skip = (page - 1) * limit;
      const data =  await this.productModel.find().limit(limit).skip(skip).exec()
      const productDtos = data.map((each : Product) => {
        return ProductDto.convertToDto(each)
      })
      return {
        count,
        products : productDtos,
        page_total : page_total,
        status : 200
      }
  }


  async updateProduct (productId : string, updatedDto : UpdateProductDto, images : Array<Express.Multer.File>) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException(ErrorMessages.notFound)
    }

    if (images) {
      const existingIamges = product.images;
      if (existingIamges) {
        const uploadPromises =  Array.from(existingIamges).map((each : string) => {
        })
      }
    }
  }


  async topSaleProducts () : Promise<ProductDto[] | ProductDto | []> {
    const topSaleProducts = await this.productModel.find({ topSale: true });
    if (!topSaleProducts) {
      return [];
    }
    return topSaleProducts.map((each : Product) => {
      return ProductDto.convertToDto(each); 
    })
  }
}
