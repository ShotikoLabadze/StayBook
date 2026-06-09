import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: any) {
    const result = await this.authService.register(userData);
    return result;
  }

  @Post('login')
  async login(@Body() loginData: any) {
    const result = await this.authService.login(loginData);
    return result;
  }
}
