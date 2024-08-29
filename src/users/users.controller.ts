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
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
// giving the controller a name on swagger
@ApiTags('Users')
export class UsersController {
  // injecting users service
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id?')
  // giving the api route a summary or decription of what it does
  @ApiOperation({
    summary: 'it fetches a list of users on the application ',
  })
  // documentation for responses
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully based on the query',
  })
  // documentation for queries
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'The number of entries returned per query',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description:
      'The position of the page number that you want the api to return',
    example: 1,
  })
  public getUsers(
    @Param() getUserParamsDto: GetUserParamsDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    // console.log(getUserParamsDto);
    // console.log(typeof id);
    // console.log(limit);
    // console.log(page);
    return this.usersService.findAll(getUserParamsDto, limit, page);
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
  }
}
