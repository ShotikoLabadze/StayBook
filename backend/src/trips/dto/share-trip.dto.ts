import { IsEmail, IsNotEmpty } from 'class-validator';

export class ShareTripDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
