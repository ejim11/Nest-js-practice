import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';

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
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguation.googleClientId;
    const clientSecret = this.jwtConfiguation.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authentication(googleTokenDto: GoogleTokenDto) {
    // verify the goole token sent by user
    // Extract the payload from Google Jwt
    // Find the user to the database using the GoogleId
    // If googleId toekn exists, generate token
    // if not create a new user and then generate tokens
    // throw unauthenticated error exception
  }
}
