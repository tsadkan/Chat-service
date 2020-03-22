
import { IsEmail, IsNotEmpty, IsBoolean, IsDateString, IsMongoId, IsString, IsOptional } from 'class-validator';

export class UserDto{
    @IsString()
    @IsMongoId()
    readonly _id: string;

    @IsNotEmpty()
    readonly name?: string;
    
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    password: string;
    
    @IsNotEmpty()
    readonly username?: string;

    @IsBoolean()
    readonly admin?: boolean;

    @IsDateString()
    readonly created_at: Date;
    
    @IsDateString()
    readonly updated_at: Date;
}