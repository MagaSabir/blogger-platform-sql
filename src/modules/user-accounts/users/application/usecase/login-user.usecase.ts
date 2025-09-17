import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class LoginUserCommand {
  constructor(
    public userId: string,
    public ip: string,
    public userAgent: string,
  ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  constructor(
    @Inject('ACCESS-TOKEN') private accessTokenContext: JwtService,
    @Inject('REFRESH-TOKEN') private refreshTokenContext: JwtService,
    // private sessionRepo: SessionRepository,
  ) {}

  async execute() {}
}
