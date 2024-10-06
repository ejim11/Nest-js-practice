import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from 'src/auth/dtos/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { SignInProvider } from '../sign-in.provider';
import { RefreshTokenDto } from 'src/auth/dtos/refresh-token.dto';
import { RefreshTokensProvider } from '../refresh-tokens.provider';

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

    /**
     * injecting the refresh token provider
     */
    private readonly refreshTokenProvider: RefreshTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    // find  the user using the email ID
    // throw an exception if the user does not exist
    // compare the password to the hash
    // send confirmation
    return await this.signInProvider.signIn(signInDto);
  }

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokenProvider.refreshTokens(refreshTokenDto);
  }

  public isAuth() {
    return true;
  }
}
