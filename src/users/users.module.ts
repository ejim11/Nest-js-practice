import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersCreaterManyProvider } from './provider/users-creater-many.provider';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import profileConfig from './config/profile.config';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersCreaterManyProvider,
    CreateUserProvider,
    FindOneUserByEmailProvider,
  ],
  exports: [UsersService],
  imports: [
    // Circular dependency injection
    forwardRef(() => AuthModule),
    // TypeOrmModule.forFeature() is a method provided by the @nestjs/typeorm package. It's used within the TypeOrmModule to specify which entities (database tables or collections) should be registered and made available within a particular module.
    TypeOrmModule.forFeature([User]),
    // Importing an enviroment config specific for this module
    ConfigModule.forFeature(profileConfig),
  ],
})
export class UsersModule {}
