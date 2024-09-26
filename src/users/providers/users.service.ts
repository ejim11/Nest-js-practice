import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUserParamsDto } from '../dtos/get-users-params.dto';
import { AuthService } from 'src/auth/providers/auth/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { UsersCreaterManyProvider } from '../provider/users-creater-many.provider';
import { CreataeManyUsersDto } from '../dtos/create-many-users.dto';

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

    // /**
    //  * Injecting datasource
    //  */
    // private readonly dataSource: DataSource,

    /**
     *Inject usersCreateManyProvider
     */
    private readonly usersCreateManyProvider: UsersCreaterManyProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser;
    // check if user already exists with same email

    try {
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error: any) {
      // Might want to save the details of the exception
      // Information which is sensitive
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
    // handle exception
    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email',
        {},
      );
    }

    // create a new user
    let newUser = this.usersRepository.create(createUserDto);

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

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
    // const isAuth = this.authService.isAuth();
    // console.log(isAuth);
    // // const environment = this.configService.get<string>('ENV');
    // // console.log(environment);
    // console.log(this.profileConfiguration.apiKey);
    // return [
    //   {
    //     firstName: 'John',
    //     email: 'john@example.com',
    //   },
    //   {
    //     firstName: 'angel',
    //     email: 'angel@example.com',
    //   },
    // ];

    // custom exception
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The API endpoint does not exist',
        fileName: 'users.service.ts',
        lineNumber: 88,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error(),
        description: 'Occured because the API endpoint was permanently moved',
      },
    );
  }

  /**
   * Finding a single user by the id of the user
   */
  //   find a user by id
  public async findOneById(id: number) {
    let user;
    try {
      user = await this.usersRepository.findOneBy({
        id,
      });
    } catch (err: any) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    /**
     * Handle the user does not exist
     */
    if (!user) {
      throw new BadRequestException('The user does not exist');
    }
    return user;
  }

  // public async createMany(createUserDto: CreateUserDto[]) {
  //   let newUsers: User[] = [];

  //   // create Query Runner instance
  //   const queryRunner = this.dataSource.createQueryRunner();

  //   // connect query runner to datasource
  //   await queryRunner.connect();

  //   // start transaction
  //   await queryRunner.startTransaction();

  //   try {
  //     for (const user of createUserDto) {
  //       /**
  //        * param
  //        * entity
  //        * dto
  //        */
  //       const newUser = queryRunner.manager.create(User, user);
  //       const result = await queryRunner.manager.save(newUser);
  //       newUsers.push(result);
  //     }

  //     // ensures the txn is committed to the db
  //     await queryRunner.commitTransaction();
  //   } catch (error) {
  //     // we rollback the txn here if it is not successful
  //     await queryRunner.rollbackTransaction();
  //   } finally {
  //     // release connection whether it was successful or not
  //     await queryRunner.release();
  //   }
  //   // if successful commit
  //   // if unsuccessful rollback
  //   // relsease the connection
  // }

  public async createMany(createManyUsersDto: CreataeManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createManyUsersDto);
  }
}
