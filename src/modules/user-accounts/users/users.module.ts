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

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [
    UsersRepository,
    UsersQueryRepository,
    CreateUserUseCase,
    DeleteUserUseCase,
    BasicStrategy,
    LocalStrategy,
    AuthService,
    PasswordService,
    GetAllUsersQueryHandler,
  ],
})
export class UsersModule {}
