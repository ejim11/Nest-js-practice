import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUserParamsDto } from '../dtos/get-users-params.dto';
import { AuthService } from 'src/auth/providers/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    // injecting auth service
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public findAll(
    getUserParamsDto: GetUserParamsDto,
    limit: number,
    page: number,
  ) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);

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
