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
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { UserResponseDTO } from './dtos/user-response.dto';
import { AdminGuard } from 'src/shared/guards/admin.guard';
import { CreateUserDTO } from './dtos/create-user.dto';
import { FindOneOptions } from 'typeorm';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryDTO } from 'src/shared/dtos/query.dto';

@Controller('users')
@UseGuards(AdminGuard)
@Serialize(UserResponseDTO)
@ApiTags('users')
@ApiBearerAuth('Authorization')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/')
  getUsers(@Query() query: QueryDTO) {
    const findOptions = new PgFilterService(query).exec();
    return this.usersService.findMany(findOptions);
  }

  @Get('/:id')
  async getUser(
    @Param('id') id: string,
    @Query('popFields') popFields: string,
  ) {
    const findOptions = new PgFilterService({
      popFields,
    }).populate().findManyOptions as FindOneOptions;

    const user = await this.usersService.findOneBy({
      where: { id },
      ...findOptions,
    } as FindOneOptions);

    return user;
  }

  @Post('/')
  createUser(@Body() user: CreateUserDTO) {
    return this.usersService.create(user as any);
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() user: any) {
    const foundUser = await this.usersService.findOneBy({
      where: { id },
    } as FindOneOptions);
    if (!foundUser) throw new NotFoundException('User not found');
    return this.usersService.update(+id, user);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.remove(+id);
    return { id };
  }
}
