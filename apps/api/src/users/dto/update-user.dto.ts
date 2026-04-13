import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

// Tous les champs sont optionnels — on ne modifie que ce qu'on envoie
export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string; // Sera hashé dans le service — jamais stocké en clair

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsUrl()
  image?: string;
}
