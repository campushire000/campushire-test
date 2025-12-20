
import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsMongoId,
  IsEnum,
  IsDateString,
  MinLength
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(6) // Security best practice
  password?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['admin', 'student', 'staff', 'recruiter']) // Restricts role values
  role?: string;

  @IsOptional()
  @IsString()
  googleId?: string;

  @IsOptional()
  @IsString()
  facebookId?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true }) // Validates every ID in the array
  group_ids?: string[];

  @IsDateString() // Dates are usually sent as strings in JSON
  createdAt: Date;

  @IsOptional()
  @IsDateString()
  updatedAt?: Date;


}