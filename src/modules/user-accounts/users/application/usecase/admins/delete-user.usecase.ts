import { UsersRepository } from '../../../infrastructure/users.repository';
import { CommandHandler } from '@nestjs/cqrs';

export class DeleteUserCommand {
  constructor(public id: number) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(command: DeleteUserCommand) {
    await this.userRepository.deleteUserById(command.id);
  }
}
