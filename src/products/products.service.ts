import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/entities/product.entity';
import { Model } from 'mongoose';
import { ProductDto } from 'src/dto/product/product.dto';
import { ErrorMessages } from 'src/constants/constants';
import { UpdateProductDto } from 'src/dto/product/updateProduct.dto';
import { CategoryService } from 'src/category/category.service';
import { ImageService } from 'src/imageService/image.service';
import { MImage } from 'src/entities/image.entity';
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel : Model<Product>,
    @Inject(forwardRef(() => CategoryService)) private categoryService: CategoryService,
    private imageService : ImageService
  ) {}

  private parseBoolean(value: string): boolean {
    return value.toLowerCase() === 'true';
  }

  async create(images: Express.Multer.File[], productDto : ProductDto): Promise<ProductDto> {
    const { categoryId,  topSale, ...productData } = productDto;
    const category = await this.categoryService.findCategoryById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
     const product = await this.productModel.create({
      ...productData,
      topSale : this.parseBoolean(topSale) ? true : false,
      categoryNameInfo : category.category_name,
      category_name : category.name,
      
    });
    
    const saveImagePromises = images.map(async (image: Express.Multer.File) => {
      const savedImage = await this.imageService.saveImages(image);
      return savedImage;
    });
    
    const savedImages = await Promise.all(saveImagePromises);
    
    savedImages.forEach(savedImage => {
      product.images.push(savedImage);
    });
    category.products.push(product);
    await category.save()
    await product.save();
    return ProductDto.convertToDto(product);
  }


  async getById (productId : string) : Promise<ProductDto | any> {
    const product = await this.productModel.findById(productId)
    .populate('images')
    if (!product) {
      throw new NotFoundException(ErrorMessages.notFound)
    } 
     return ProductDto.convertToDto(product);
  }


async deleteProduct (productId : string) {
  const product = await this.productModel.findById(productId);
  if (!product) {
    throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
  }
  await this.productModel.deleteOne({ _id : productId }) 
  
  if (product.images) {
   const deleteImagesPromises =  product.images.map(async (each : MImage) => {
      await this.imageService.deleteImage(each._id);
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
      const data =  await this.productModel
      .find()
      .populate('images')
      .limit(limit)
      .skip(skip)
      .exec()
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
    const product = await this.productModel.findById(productId)
    .populate('images');
    if (!product) {
      throw new NotFoundException(ErrorMessages.notFound)
    }
   
    if (images) {
      const imagesToDelete = updatedDto.imageIds;
      if (imagesToDelete && imagesToDelete.length) {
         const deletedPromsies =  product.images.map(async (each : any) => {
            if (imagesToDelete.includes(each._id.toString())) {
              await this.imageService.deleteImage(each._id);
          }
          })
          Promise.all(deletedPromsies);
      }
      const addedIamges = images.map(async (each : Express.Multer.File) => {
       return product.images.push(await this.imageService.saveImages(each));
      })
      await Promise.all(addedIamges);
    }
    Object.entries(updatedDto).forEach(([key, value]) => {
        if (typeof value === 'object' && !Array.isArray(value)) {
          Object.entries(value).forEach(([nestedObjectkey, nestedObjectvalue]) => {
            product[key][nestedObjectkey] = nestedObjectvalue;
          })
        } else {
          product[key] = value
        }
    })
    const updatedOne = await product.save()
    await this.productModel.findOneAndUpdate(
      { _id: productId },
      { $set: updatedOne },
  );
  return {
    status : HttpStatus.OK
  };
}


  async topSaleProducts () : Promise<ProductDto[] | ProductDto | []> {
    const topSaleProducts = await this.productModel.find({ topSale: true }).populate('images');
    if (!topSaleProducts) {
      return [];
    }
    return topSaleProducts.map((each : Product) => {
      return ProductDto.convertToDto(each); 
    })
  }
}
