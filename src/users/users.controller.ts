import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  // Headers,
  // Ip,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  // ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserParamsDto } from './dtos/get-users-params.dto';
import { PatchUserDto } from './dtos/patch-user.dto';

@Controller('users')
export class UsersController {
  @Get('/:id?')
  public getUsers(
    @Param() getUserParamsDto: GetUserParamsDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    console.log(getUserParamsDto);
    // console.log(typeof id);
    // console.log(limit);
    // console.log(page);
    return 'You sent a get request to users endpoint';
  }

  @Post()
  public createUsers(
    @Body() createUserDto: CreateUserDto,
    // @Headers() headers: any,
    // @Ip() ip: any,
  ) {
    console.log(createUserDto);
    return 'You sent a post request to users endpoint';
  }

  @Patch()
  public patchUsers(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
    ``;
  }
}
