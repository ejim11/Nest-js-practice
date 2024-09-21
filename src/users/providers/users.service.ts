import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUserParamsDto } from '../dtos/get-users-params.dto';
import { AuthService } from 'src/auth/providers/auth/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';

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

    /**
     * Injecting the user repository
     */
    @InjectRepository(User) private usersRepository: Repository<User>,

    /**
     * Injecting the config service
     */

    private readonly configService: ConfigService,

    /**
     * Injecting the profile config
     */
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    // check if user already exists with same email
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    // handle exception
    // create a new user
    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);

    return newUser;
  }

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

    // const environment = this.configService.get<string>('ENV');
    // console.log(environment);

    console.log(this.profileConfiguration.apiKey);

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
  public async findOneById(id: number) {
    return await this.usersRepository.findOneBy({
      id,
    });
  }
}
