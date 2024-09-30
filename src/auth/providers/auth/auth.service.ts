import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from 'src/auth/dtos/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { SignInProvider } from '../sign-in.provider';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Injecting the usersService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /**
     * Injecting the signInProvider
     */
    private readonly signInProvider: SignInProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    // find  the user using the email ID
    // throw an exception if the user does not exist
    // compare the password to the hash
    // send confirmation
    return await this.signInProvider.signIn(signInDto);
  }

  public isAuth() {
    return true;
  }
}
