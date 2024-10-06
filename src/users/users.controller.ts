import {
  Body,
  ClassSerializerInterceptor,
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
  UseInterceptors,
  // SetMetadata,
  // UseGuards,
  // ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserParamsDto } from './dtos/get-users-params.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreataeManyUsersDto } from './dtos/create-many-users.dto';
// import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

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
  // @SetMetadata('authType', 'none')
  @Auth(AuthType.None)
  @UseInterceptors(ClassSerializerInterceptor)
  public createUsers(
    @Body() createUserDto: CreateUserDto,
    // @Headers() headers: any,
    // @Ip() ip: any,
  ) {
    return this.usersService.createUser(createUserDto);
  }

  // @UseGuards(AccessTokenGuard)
  @Post('/create-many')
  public createManyUsers(
    @Body() createManyUsersDto: CreataeManyUsersDto,
    // @Headers() headers: any,
    // @Ip() ip: any,
  ) {
    return this.usersService.createMany(createManyUsersDto);
  }

  @Patch()
  public patchUsers(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}
