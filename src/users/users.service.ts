import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../entities/user.entity'
import { UserRoles } from '../enums/Roles.enum';
import { ErrorMessages } from '../constants/constants';
import { UserUpdateDto } from '../dto/user/update.user.dto';
import { NewUserDto } from '../dto/user/new.user.dto';
import { UserDto } from '../dto/user/existing.user.dto';
@Injectable()
export class UserService {
        constructor (
            @InjectModel(User.name) private readonly userModel: Model<User>,
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
        
              if (!updatedUser.modifiedCount) {
                throw new HttpException({ message : 'Product not found in user\'s products array' }, HttpStatus.NOT_FOUND );
              }
              const user = await this.userModel.findById(userId);
              return user;
            } catch (error) {
              throw new HttpException({message  : `Failed to remove product from user: ${error.message}`}, HttpStatus.INTERNAL_SERVER_ERROR);
            }
          }

          async createUser (userDto : NewUserDto) {
            const { email, password, name, phoneNumber } = userDto;
            const isExist = await this.findByEmail(email);
            if (isExist) {
              throw new HttpException({ message : 'User already exist' }, HttpStatus.BAD_REQUEST);
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
              throw new HttpException({ message : `User with id ${userId} not found` }, HttpStatus.NOT_FOUND)
            };
            let updateData: Partial<User> = { ...userDto};
            const updatedUser = await this.userModel.findByIdAndUpdate(user, { ...updateData }, { new: true }).select('-password -roles');
            return UserDto.convertToDto(updatedUser);
          }

          async getAll() : Promise<UserDto | UserDto[] | []> {
            const users = await this.userModel.find();
            if (!users.length) {
              throw new HttpException({message : 'Users not found' }, HttpStatus.NOT_FOUND)
            }
            return users.map((each : User) => {
              return UserDto.convertToDto(each);
            })
          }
}

