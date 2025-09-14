import { CreateUserDto } from '../../../dto/create-user.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { UserViewModel } from '../../../api/view-dto/user-view-model';
import { PasswordService } from '../../services/password.service';

export class CreateUserCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private passwordService: PasswordService,
  ) {}
  async execute(command: CreateUserCommand): Promise<UserViewModel> {
    const passwordHash = await this.passwordService.hash(command.dto.password);
    const dto = {
      login: command.dto.login,
      email: command.dto.email,
      passwordHash,
    };
    return this.usersRepository.createUser(dto);
  }
}

export type CreateUserType = {
  login: string;
  email: string;
  passwordHash: string;
};
