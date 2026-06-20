import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTripDto {
  @IsNotEmpty() @IsString() title!: string;
  @IsNotEmpty() @IsString() destination!: string;
  @IsNotEmpty() @IsDateString() startDate!: string;
  @IsNotEmpty() @IsDateString() endDate!: string;

  @IsOptional() @IsDateString() checkIn?: string;
  @IsOptional() @IsDateString() checkOut?: string;
  @IsOptional() @IsNumber() guests?: number;
  @IsOptional() @IsNumber() totalPrice?: number;
  @IsOptional() @IsString() hotelId?: string;

  @IsOptional() @IsObject() budget?: {
    totalLimit: number;
    currency: string;
  };
}
