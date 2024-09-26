import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
// import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreataeManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreaterManyProvider {
  constructor(
    /**
     * Injecting datasource
     */
    private readonly dataSource: DataSource,
  ) {}

  public async createMany(createManyUsersDto: CreataeManyUsersDto) {
    const newUsers: User[] = [];

    // create Query Runner instance
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // connect query runner to datasource
      await queryRunner.connect();

      // start transaction
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException('Could not connect to datasource');
    }

    try {
      for (const user of createManyUsersDto.users) {
        /**
         * param
         * entity
         * dto
         */
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }

      // if successful commit
      // ensures the txn is committed to the db
      await queryRunner.commitTransaction();
    } catch (error) {
      // if unsuccessful rollback
      // we rollback the txn here if it is not successful
      await queryRunner.rollbackTransaction();

      throw new ConflictException('Could not complete the transaction', {
        description: String(error),
      });
    } finally {
      // relsease the connection
      // release connection whether it was successful or not
      try {
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException('Could not release the connection', {
          description: String(error),
        });
      }
    }

    return newUsers;
  }
}
