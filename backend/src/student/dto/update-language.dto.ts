import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateLanguageDto {
    @IsOptional()
    @IsString()
    _id?: string;

    @IsString()
    language: string;

    @IsString()
    proficiency: string;

    @IsBoolean()
    can_read: boolean;

    @IsBoolean()
    can_write: boolean;

    @IsBoolean()
    can_speak: boolean;
}
