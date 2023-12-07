import {
  IsAlphanumeric,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @MinLength(2, {
    message: 'Description must have atleast 2 characters.',
  })
  @IsNotEmpty()
  todo: string;

  @IsNotEmpty()
  uid: number;

  @IsNotEmpty()
  orgid: number;
}
