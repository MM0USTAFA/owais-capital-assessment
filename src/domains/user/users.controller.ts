import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PgFilterService } from 'src/shared/services/pg-filter.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { UserResponseDTO } from './dtos/user-response.dto';
import { AdminGuard } from 'src/shared/guards/admin.guard';
import { CreateUserDTO } from './dtos/create-user.dto';

@Controller('users')
@UseGuards(AuthGuard, AdminGuard)
@Serialize(UserResponseDTO)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/')
  getUsers(@Query() query: any) {
    const findOptions = new PgFilterService(query).exec();
    return this.usersService.findMany(findOptions);
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Post('/')
  createUser(@Body() user: CreateUserDTO) {
    return this.usersService.create(user as any);
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() user: any) {
    const foundUser = await this.usersService.findOneBy({ id });
    if (!foundUser) throw new NotFoundException('User not found');
    return this.usersService.update(+id, user);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    const foundUser = await this.usersService.findOneBy({ id });
    if (!foundUser) throw new NotFoundException('User not found');
    await this.usersService.remove(+id);
    return { id };
  }
}
