import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SECRET',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOneByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException('User not found or session invalid!');
    }

    return {
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
