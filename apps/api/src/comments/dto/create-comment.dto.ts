import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  body!: string;
  // Le ! est le "definite assignment assertion" TypeScript
  // Il dit au compilateur : "je garantis que ce champ sera assigné"
}
