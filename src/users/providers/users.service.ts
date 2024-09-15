import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUserParamsDto } from '../dtos/get-users-params.dto';
import { AuthService } from 'src/auth/providers/auth/auth.service';

/**
 * Class to connect users table and connect business operations
 */
@Injectable()
export class UsersService {
  /**
   * The constructor makes authService available by dependency injection
   */
  constructor(
    // injecting auth service
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  /**
   * The method to get all users from the database
   */
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

  /**
   * Finding a single user by the id of the user
   */
  //   find a user by id
  public findOneById(id: string) {
    return {
      id: 7439822,
      firstname: 'John',
      email: 'john@example.com',
    };
  }
}
