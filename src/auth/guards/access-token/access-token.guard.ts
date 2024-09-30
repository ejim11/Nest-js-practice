import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from 'src/auth/config/jwt.config';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constant';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    /**
     * Inject jwtService
     */
    private readonly jwtService: JwtService,

    /**
     * inject jwt config
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // we can grab the request from the excetion context
    const request = context.switchToHttp().getRequest();

    // extract the token from the header
    const token = this.extractRequestFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    // validate the token
    try {
      // if the token is valid, jwt returns the payload which contains info for indetifying the user
      const payload = await this.jwtService.verify(
        token,
        this.jwtConfiguration,
      );

      request[REQUEST_USER_KEY] = payload;
      // console.log(payload);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      throw new UnauthorizedException();
    }

    // accept or deny req based on validation
    return true;
  }

  private extractRequestFromHeader(request: Request): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
