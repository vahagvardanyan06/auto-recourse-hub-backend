import { UserDto } from "src/dto/user/newUser.dto";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../entities/user.entity'
import { UserRoles } from 'src/enums/Roles.enum';
import { ErrorMessages } from 'src/constants/constants';
import { S3Service } from 'src/s3Service/s3.service';
import { UserUpdateDto } from 'src/dto/user/existingUser.dto';
@Injectable()
export class UserService {
        constructor (
            @InjectModel(User.name) private readonly userModel: Model<User>,
            private s3Service : S3Service
        ) {}
    
        async findById (id : string) : Promise<User> {
            return await this.userModel.findOne({
              _id : id
            })
        }

         async findByEmail (email : string) : Promise<User> {
            return await this.userModel.findOne({ email : email })
        }
        async removeProductFromUser(userId: string, productId: string): Promise<User> {
            try {
              const updatedUser = await this.userModel.updateOne(
                { _id: userId },
                { $pull: { products: productId } }
              );
        
              if (updatedUser.modifiedCount === 0) {
                throw new Error('Product not found in user\'s products array');
              }
              const user = await this.userModel.findById(userId);
              return user;
            } catch (error) {
              throw new Error(`Failed to remove product from user: ${error.message}`);
            }
          }

          async createUser (userDto : UserDto) {
            const { email, password, name, phoneNumber } = userDto;
            const isExist = await this.findByEmail(email);
            if (isExist) {
              throw new ConflictException();
            } 
            const newUser = await this.userModel.create ({
              name,
              email,
              password,
              phoneNumber,
              roles : UserRoles.Admin,
            })
            return UserDto.convertToDto(await newUser.save())
          }

          async updateUser (userId : string, userDto : UserUpdateDto) {
            const user = await this.findById(userId);
            if (!user) {
              throw new NotFoundException(`User with id ${userId} not found`)
            };
        
            let updateData: Partial<User> = { ...userDto};
            const updatedUser = await this.userModel.findByIdAndUpdate(user, { ...updateData }, { new: true }).select('-password -roles');
            return updatedUser;
          }

          async getAll() {
            const users = await this.userModel.find().select('-password -roles')
            if (!users.length) {
              throw new NotFoundException(ErrorMessages.notFound)
            }
            return users;
          }
}

