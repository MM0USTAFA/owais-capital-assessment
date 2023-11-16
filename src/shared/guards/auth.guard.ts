import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CustomConfigService } from '../services/custom-config.service';
import { UsersService } from 'src/domains/users/users.service';
import { TokenDTO } from 'src/domains/auth/dtos/token.dto';
import { plainToClass } from 'class-transformer';
import { User } from 'src/domains/users/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: CustomConfigService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('token is required');
    let user: User = null;
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      });

      const payloadDto: TokenDTO = plainToClass(TokenDTO, payload);

      user = await this.usersService.findOneBy({
        id: payloadDto.id,
      });

      if (!user) throw new UnauthorizedException('Invalid token');

      request['user'] = user;

      if (user.isActive)
        throw new UnauthorizedException(
          'inactive user please check your email',
        );
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
