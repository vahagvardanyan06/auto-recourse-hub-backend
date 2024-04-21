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
    notFound : 'Not found'
} 









