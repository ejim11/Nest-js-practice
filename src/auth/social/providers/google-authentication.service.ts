import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';

/**
 * if you want to instantiate some properties in the class, onModuleInit can be used
 */

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    /**
     * Injecting jwtConfig
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguation: ConfigType<typeof jwtConfig>,

    /**
     * injecting users service
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /**
     * injecting generate tokens provider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguation.googleClientId;
    const clientSecret = this.jwtConfiguation.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authentication(googleTokenDto: GoogleTokenDto) {
    // verify the goole token sent by user
    const loginTicket = await this.oauthClient.verifyIdToken({
      idToken: googleTokenDto.token,
    });

    // Extract the payload from Google Jwt
    const { email, sub: googleId } = loginTicket.getPayload();

    // Find the user to the database using the GoogleId
    const user = await this.usersService.findOneByGoogleId(googleId);

    // If googleId toekn exists, generate token
    if (user) {
      return this.generateTokensProvider.generateTokens(user);
    }

    // if not create a new user and then generate tokens
    // throw unauthenticated error exception
  }
}
