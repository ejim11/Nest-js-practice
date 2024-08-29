import { Injectable } from '@nestjs/common';
import { GetUserParamsDto } from '../dtos/get-users-params.dto';

@Injectable()
export class UsersService {
  public findAll(
    getUserParamsDto: GetUserParamsDto,
    limit: number,
    page: number,
  ) {
    return [
      {
        firstName: 'John',
        email: 'john@example.com',
      },
      {
        firstName: 'angel',
        email: 'angel@example.com',
      },
    ];
  }

  //   find a user by id
  public findOneById(id: string) {
    return {
      id: 7439822,
      firstname: 'John',
      email: 'john@example.com',
    };
  }
}
