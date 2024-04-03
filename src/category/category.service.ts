import { BadRequestException, HttpCode, HttpException, HttpStatus, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryUpdateDto } from 'src/dto/category/categoryUpdateDto';
import { CategoryDto } from 'src/dto/category/category.dto';
import { Category } from 'src/entities/category.entity';
import { CategoryNameInfo } from 'src/dto/category/categoryName.dto';
import { MImage } from 'src/entities/image.entity';
import { ImageService } from 'src/imageService/image.service';
import { log } from 'console';
import { Product } from 'src/entities/product.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CategoryService {

  constructor (
    @InjectModel(Category.name) private readonly category_model: Model<Category>,
    // private productService : ProductsService,
    @Inject(forwardRef(() => ProductsService)) private productService: ProductsService,
    private imageService : ImageService
  ) {}

  async findByDisplayName (name : CategoryNameInfo) : Promise<Category | null> {
    const { am, us, ru } = name;
    const category = await this.category_model.findOne({
      $or: [
        { 'category_name.am': am },
        { 'category_name.us': us },
        { 'category_name.ru': ru }
      ]
    });
    return category;
  }


  private async findByName(name : string) {
    return await this.category_model.findOne({ name })
    .populate('logo_url')
    .populate({
      path: 'products',
      populate: {
        path: 'images', 
        model: `${MImage.name}`,
      }
    });
  }

  async createCategory (categoryDto : CategoryDto, logo : Express.Multer.File) : Promise<CategoryDto> {
      const { category_name } = categoryDto;
      const isCategoryExist = await this.findByDisplayName(category_name);

      if (isCategoryExist) {
        throw new BadRequestException("Category already exist")
      }
      const { us } = category_name;
      const modifiedUsName = us.replace(/\s+/g, '_').toLowerCase();
      const image = await this.imageService.saveImages(logo);
      
      const newCategory = await this.category_model.create({
        category_name,
        logo_url : image,
        name : modifiedUsName
      });
      return CategoryDto.convertToDto(await newCategory.save(), false);
  }

  async getAllCategories () : Promise<CategoryDto | CategoryDto[] | [] | any> {
      const allCategories = await this.category_model.find()
      .populate('logo_url')
      if (!allCategories) {
          return [];
      } 
      return allCategories.map(categoryEntity => CategoryDto.convertToDto(categoryEntity, false));
  }

    async findCategoryById (id : string) : Promise<Category | null> {
      return await this.category_model.findById(id)
      .populate('logo_url')
      .populate({
      path: 'products',
      populate: {
        path: 'images', 
        model: `${MImage.name}`,
      }})
      ;
    }

  async getCategoryById (categoryId : string) : Promise<CategoryDto | NotFoundException> {
    const category = await this.category_model.findById(categoryId)
    .populate('logo_url')
    .populate({
      path: 'products',
      populate: {
        path: 'images', 
        model: `${MImage.name}`,
      }
    });
      if (!category) {
        return new NotFoundException("Category not found")
      }
      return CategoryDto.convertToDto(category, true);
  }

  async updateCategory (categoryId : string, categoryDto : CategoryUpdateDto, logo? : Express.Multer.File ) : Promise<CategoryDto | NotFoundException> {
    const existingCategory = await this.findCategoryById(categoryId);
    if (!existingCategory) {
        return new NotFoundException("Category not found")
    }
    if (logo) {
      await this.imageService.deleteImage(existingCategory.logo_url._id);
      existingCategory.logo_url =  await this.imageService.saveImages(logo);
    } 
    if (categoryDto.category_name) {
      Object.keys(categoryDto.category_name).forEach(key => {
        if (categoryDto.category_name[key] !== undefined) {
            existingCategory.category_name[key] = categoryDto.category_name[key];
        }
      });
  }
  
    const updatedOne = await existingCategory.save();
    await this.category_model.findOneAndUpdate(
      { _id: categoryId },
      { $set: updatedOne },
    ).populate('logo_url'); 
    return CategoryDto.convertToDto(updatedOne, false);
  }

  async getCategoryWithName (name : string) : Promise<CategoryDto | NotFoundException> {
    const category = await this.findByName(name);
    if (!category) {
      throw new NotFoundException(`Category with name ${name} not found`)
    }
    return CategoryDto.convertToDto(category,true);
  }

  async removeProductFromCategories(productId: string) {
    const categories = await this.category_model.find({ products: productId });
    for (const category of categories) {
      await this.removeProductFromCategory(category._id, productId);
    }
  }

  async deleteCategory(categoryId : string) : Promise<CategoryDto | any> {
    const category = await this.category_model.findById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found')
    }
    if (category.products) {
      const deletedProducts = category.products.map(async (each : Product) => {
        await this.productService.deleteProduct(each._id);
      })
      Promise.all(deletedProducts);
    }
    await this.imageService.deleteImage( category.logo_url._id);
    await this.category_model.deleteOne({ _id : categoryId });
    return { status :  HttpStatus.OK };
  }

  async removeProductFromCategory(categoryId: string, productId: string): Promise<Category> {
    try {
      const updatedCategory = await this.category_model.updateOne(
        { _id: categoryId },
        { $pull: { products: productId } }
      );

      if (updatedCategory.modifiedCount === 0) {
        throw new Error('Product not found in Category\'s products array');
      }

      const category = await this.category_model.findById(categoryId);
      return category;
    } catch (error) {
      throw new Error(`Failed to remove product from category: ${error.message}`);
    }
  }
}
