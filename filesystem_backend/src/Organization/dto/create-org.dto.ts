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

export class CreateOrgDto {
  @IsString()
  @MinLength(2, {
    message: 'Organization name must have atleast 2 characters.',
  })
  @IsNotEmpty()
  org_name: string;

  @IsNotEmpty()
  users: number[];

  @IsBoolean()
  is_active: boolean;

  @IsString()
  @MinLength(2, { message: 'Domain must have atleast 2 characters.' })
  @IsNotEmpty()
  domain: string;
}
