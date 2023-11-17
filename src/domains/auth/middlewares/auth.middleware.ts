import { Inject, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { User } from 'src/domains/users/user.entity';
import { UsersService } from 'src/domains/users/users.service';
import { CustomConfigService } from 'src/shared/services/custom-config.service';
import { TokenDTO } from '../dtos/token.dto';
import { plainToClass } from 'class-transformer';

export class AuthMiddleware implements NestMiddleware {
  constructor(
    private usersService: UsersService,
    @Inject(JwtService) private jwtService: JwtService,
    private configService: CustomConfigService,
  ) {}

  extractTokenFromHeader(req: Request) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async use(req: Request, res: Response, next: (error?: any) => void) {
    const token = this.extractTokenFromHeader(req);

    if (!token) throw new UnauthorizedException('token is required');
    let user: User = null;
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      });

      const payloadDto: TokenDTO = plainToClass(TokenDTO, payload);

      user = await this.usersService.findOneBy({
        where: { id: payloadDto.id },
      });

      if (!user) throw new UnauthorizedException('Invalid token');

      req['user'] = user;

      if (!user.isActive)
        throw new UnauthorizedException('inactive user please call the issuer');
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
    next();
  }
}
