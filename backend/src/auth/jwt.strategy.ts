import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SECRET',
    });

    this.logger.debug(
      `JWT_SECRET loaded: ${process.env.JWT_SECRET ? 'YES' : 'NO'}`,
    );
  }

  async validate(payload: any) {
    this.logger.debug('JWT Strategy: Validating payload:', payload);

    const user = await this.usersService.findOneByEmail(payload.email);

    if (!user) {
      this.logger.error(`User with email ${payload.email} not found.`);
      throw new UnauthorizedException('User not found or session invalid!');
    }

    return {
      id: String(user._id),
      email: user.email,
      name: user.name,
    };
  }
}
