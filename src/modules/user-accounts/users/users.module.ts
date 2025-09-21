import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersQueryRepository } from './infrastructure/query-repository/users.query-repository';
import { UsersRepository } from './infrastructure/users.repository';
import { CreateUserUseCase } from './application/usecase/admins/create-user.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteUserUseCase } from './application/usecase/admins/delete-user.usecase';
import { BasicStrategy } from '../guards/basic/basic.strategy';
import { LocalStrategy } from '../guards/local/local.strategy';
import { AuthService } from './application/services/auth.service';
import { PasswordService } from './application/services/password.service';
import { GetAllUsersQueryHandler } from './application/queries/get-all-users.query';
import { UsersConfig } from '../config/users.config';
import { RegistrationUserUseCase } from './application/usecase/registration-user.usecase';
import { AuthController } from './api/auth.controller';
import { JwtService } from '@nestjs/jwt';
import { LoginUserUseCase } from './application/usecase/login-user.usecase';
import { SessionRepository } from '../sessions/infrastructure/session-repository';
import { CoreConfig } from '../../../core/config/core.config';
import { JwtStrategy } from '../guards/bearer/jwt-strategy';
import { GetUserQueryHandler } from './application/queries/get-user.query';
import { AuthQueryRepository } from './infrastructure/query-repository/auth.query-repository';
import { RegistrationConfirmationUseCase } from './application/usecase/registration-confirmation.usecase';
import { ResendConfirmationEmailUseCase } from './application/usecase/resend-confirmation-email.usecase';
import { PasswordRecoveryUseCase } from './application/usecase/password-recovery.usecase';
import { NewPasswordUseCase } from './application/usecase/new-password.usecase';

const commandHandlers = [
  CreateUserUseCase,
  DeleteUserUseCase,
  RegistrationUserUseCase,
  LoginUserUseCase,
  RegistrationConfirmationUseCase,
  ResendConfirmationEmailUseCase,
  PasswordRecoveryUseCase,
  NewPasswordUseCase,
];

const refreshTokenConnectionProvider = [
  {
    provide: 'ACCESS-TOKEN',
    useFactory: (coreConfig: CoreConfig): JwtService => {
      return new JwtService({
        secret: coreConfig.accessTokenSecret,
        signOptions: { expiresIn: '10m' },
      });
    },
    inject: [CoreConfig],
  },

  {
    provide: 'REFRESH-TOKEN',
    useFactory: (coreConfig: CoreConfig): JwtService => {
      return new JwtService({
        secret: coreConfig.refreshTokenSecret,
        signOptions: { expiresIn: '20m' },
      });
    },
    inject: [CoreConfig],
  },
];
@Module({
  imports: [CqrsModule],
  controllers: [UsersController, AuthController],
  providers: [
    ...refreshTokenConnectionProvider,
    UsersConfig,
    UsersRepository,
    UsersQueryRepository,
    AuthQueryRepository,
    SessionRepository,
    BasicStrategy,
    LocalStrategy,
    JwtStrategy,
    AuthService,
    PasswordService,
    GetAllUsersQueryHandler,
    GetUserQueryHandler,
    ...commandHandlers,
  ],
})
export class UsersModule {}
