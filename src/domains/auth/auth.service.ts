import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { SignUpDTO } from './dtos/signup.dto';
import { HashService } from 'src/shared/services/hash.service';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { TokenDTO } from './dtos/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async signUp(signupData: SignUpDTO) {
    signupData.password = await this.hashService.hash(signupData.password);
    return this.usersService.create(signupData as any);
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOneBy({ email });

    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isValidPassword = await this.hashService.compare(
      user.password,
      password,
    );

    if (!isValidPassword)
      throw new UnauthorizedException('Invalid email or password');

    const payload = plainToClass(
      TokenDTO,
      { ...user },
      { excludeExtraneousValues: true },
    );

    const token = await this.jwtService.signAsync({ ...payload });
    return { user: payload, token };
  }
}
