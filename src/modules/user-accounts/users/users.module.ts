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
const commandHandlers = [
  CreateUserUseCase,
  DeleteUserUseCase,
  RegistrationUserUseCase,
];

const refreshTokenConnectionProvider = [
  {
    provide: 'ACCESS-TOKEN',
    useFactory: (): JwtService => {
      return new JwtService({
        secret: 'access-token-secret',
        signOptions: { expiresIn: '10m' },
      });
    },
  },

  {
    provide: 'REFRESH-TOKEN',
    useFactory: (): JwtService => {
      return new JwtService({
        secret: 'refresh-token-secret',
        signOptions: { expiresIn: '20m' },
      });
    },
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
    BasicStrategy,
    LocalStrategy,
    AuthService,
    PasswordService,
    GetAllUsersQueryHandler,
    ...commandHandlers,
  ],
})
export class UsersModule {}
