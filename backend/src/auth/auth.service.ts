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
      throw new BadRequestException('ეს იმეილი უკვე რეგისტრირებულია!');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });

    const { password, ...result } = newUser.toObject();
    return result;
  }

  async login(loginData: any) {
    const user = await this.usersService.findOneByEmail(loginData.email);
    if (!user) {
      throw new UnauthorizedException('იმეილი ან პაროლი არასწორია!');
    }

    const isPasswordMatch = await bcrypt.compare(
      loginData.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException('იმეილი ან პაროლი არასწორია!');
    }

    const payload = { sub: user._id, email: user.email, name: user.name };

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }
}
