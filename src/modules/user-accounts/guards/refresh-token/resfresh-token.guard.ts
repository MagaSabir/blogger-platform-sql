import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionRepository } from '../../sessions/infrastructure/session-repository';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadType } from '../../types/token-payload-type';
import { SessionsType } from '../../sessions/type/sessions-type';
import { AuthenticatedRequest } from '../../../../core/interfaces/authenticated-request';

export class RefreshTokenGuard implements CanActivate {
  constructor(
    private sessionRepository: SessionRepository,
    @Inject('REFRESH-TOKEN') private refreshTokenContext: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();
    const token: string = request.cookies['refreshToken'];
    console.log(token);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: TokenPayloadType = this.refreshTokenContext.verify(token);
      console.log(payload);
      const sessions: SessionsType | null =
        await this.sessionRepository.getSession(
          payload.userId,
          payload.deviceId,
        );

      if (!sessions || sessions.lastActiveDate / 1000 !== payload.iat) {
        throw new UnauthorizedException('Invalid session');
      }

      request.payload = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh Token');
    }
  }
}
