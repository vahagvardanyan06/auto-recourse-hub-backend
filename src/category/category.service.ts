import { HttpCode, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryUpdateDto } from 'src/dto/category/categoryUpdateDto';
import { CategoryDto } from 'src/dto/category/category.dto';
import { Category } from 'src/entities/category.entity';
import { CategoryNameInfo } from 'src/dto/category/categoryName.dto';

@Injectable()
export class CategoryService {

  constructor (
    @InjectModel(Category.name) private readonly category_model: Model<Category>,

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
    return await this.category_model.findOne({ name }).populate("products");
  }

  async createCategory (categoryDto : CategoryDto) : Promise<CategoryDto> {
      const { category_name, logo_url, name } = categoryDto;
      const isCategoryExist = await this.findByDisplayName(category_name);
      if (isCategoryExist) {
        throw new HttpException("Category already exist", HttpStatus.BAD_REQUEST)
      }
      const newCategory = await this.category_model.create({
        category_name,
        logo_url,
        name
      })
      return CategoryDto.convertToDto(await newCategory.save(), false);
  }

  async getAllCategories () : Promise<CategoryDto | CategoryDto[] | [] | any> {
      const allCategories = await this.category_model.find();
      if (!allCategories) {
          return [];
      } 

      return allCategories.map(categoryEntity => CategoryDto.convertToDto(categoryEntity, false));
  }

    async findById (id : string) : Promise<Category | null> {
      return await this.category_model.findById(id);
  }

  async getCategoryById (categoryId : string) : Promise<CategoryDto | NotFoundException> {
    const category = await this.category_model.findById(categoryId).populate("products");
    
      if (!category) {
        return new NotFoundException("Category not found")
      }
      return CategoryDto.convertToDto(category, true);
  }

  async updateCategory (categoryId : string, categoryDto : CategoryUpdateDto) : Promise<CategoryDto | NotFoundException> {
      const existingCategory = await this.findById(categoryId);
      if (!existingCategory) {
        return new NotFoundException("Category not found")
      }

    Object.assign(existingCategory, categoryDto);

    const updatedCategory = await existingCategory.save()
    return CategoryDto.convertToDto(updatedCategory, false);
  }

  async getCategoryWithName (name : string) : Promise<CategoryDto | NotFoundException> {
    const category = await this.findByName(name);
    if (!category) {
      return new NotFoundException(`Category with name ${name} not found`)
    }
    return CategoryDto.convertToDto(category,true);
  }

  async removeProductFromCategories(productId: string) {
    const categories = await this.category_model.find({ products: productId });

    for (const category of categories) {
      await this.removeProductFromCategory(category._id, productId);
    }
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
