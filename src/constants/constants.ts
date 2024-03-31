import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { type } from 'os'

export const Route = {
    entry : 'auth',
    signIn : 'signin',
    signup : 'signup',
}

export const ErrorMessages = {
    alreadyExists : 'UserAlreadyExists',
    internalServerError : 'Internal Server Error',
    invalidCredentials : 'Invalid email or password',
    notFound : 'Product not found'
} 



export class UserAvatarRequestBody  {
    @ApiProperty({ name : 'userId', type : String, required : true })
    @IsNotEmpty()
    userId : string

    @ApiProperty({ name : 'fileName', type : String, required : true})
    @IsNotEmpty()
    fileName : String
}






