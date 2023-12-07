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

export class CreateNotesDto {
  @IsString()
  @MinLength(2, {
    message: 'Title must have atleast 2 characters.',
  })
  @IsNotEmpty()
  title: string;

  @IsString()
  @MinLength(2, {
    message: 'Description must have atleast 2 characters.',
  })
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  uid: number;

  @IsNotEmpty()
  orgid: number;

  isdeleted: boolean;
}
