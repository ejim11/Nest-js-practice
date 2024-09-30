import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { Observable } from 'rxjs';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constant';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  // using static means you can use the name of the property of the class without the "this" keyword
  private static readonly defaultAuthType = AuthType.Bearer;

  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.None]: { canActivate: () => true },
  };

  constructor(
    /**
     * injecting the reflector class
     * The reflector class makes you access diff metadata from the execution context
     */
    private readonly reflector: Reflector,

    /**
     * Injecting the access token guard
     *
     */
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // console.log(this.authTypeGuardMap);
    // Get all the auth types from reflector
    // This returns an array of the auth types for a specific class or method in a class
    const authTypes = this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthType];

    // console.log(authTypes);

    // create an array of the guards

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    // console.log(guards);

    // Default error
    const error = new UnauthorizedException();

    // loop through the guards and fire the canActivate
    for (const instance of guards) {
      // console.log(instance);

      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => {
        return { error: err };
      });

      // console.log(canActivate);

      if (canActivate) {
        return true;
      }
    }

    throw error;
  }
}
