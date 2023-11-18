import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dtos/signup.dto';
import { SignInDTO } from './dtos/signin.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller({
  path: 'auth',
  version: ['1'],
})
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() user: SignUpDTO) {
    return this.authService.signUp(user);
  }

  @Post('/signin')
  singIn(@Body() body: SignInDTO) {
    return this.authService.signIn(body.email, body.password);
  }
}
