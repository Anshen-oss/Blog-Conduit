import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  body!: string;

  // Les tags sont optionnels à la création
  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // chaque élément du tableau doit être une string
  tagList?: string[];
}
