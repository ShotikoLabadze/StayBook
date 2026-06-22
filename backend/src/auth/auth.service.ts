import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(userData: any) {
    const userExists = await this.usersService.findOneByEmail(userData.email);
    if (userExists) {
      throw new BadRequestException('This email is already registered!');
    }

    const newUser = await this.usersService.create(userData);

    const { password, ...result } = newUser.toObject();
    return result;
  }

  async login(loginData: any) {
    const user = await this.usersService.findOneByEmail(loginData.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password!');
    }

    const isPasswordMatch = await bcrypt.compare(
      loginData.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid email or password!');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }
}
