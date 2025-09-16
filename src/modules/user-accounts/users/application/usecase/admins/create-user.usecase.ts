import { CreateUserDto } from '../../../dto/create-user.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { UserViewModel } from '../../../api/view-dto/user-view-model';
import { PasswordService } from '../../services/password.service';
import { UsersConfig } from '../../../../config/users.config';

export class CreateUserCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private passwordService: PasswordService,
    private userConfig: UsersConfig,
  ) {}
  async execute(command: CreateUserCommand): Promise<UserViewModel> {
    const passwordHash = await this.passwordService.hash(command.dto.password);
    const dto = {
      login: command.dto.login,
      email: command.dto.email,
      passwordHash,
      isConfirmed: this.userConfig.isAutoConfirmed,
    };
    return this.usersRepository.createUser(dto);
  }
}
