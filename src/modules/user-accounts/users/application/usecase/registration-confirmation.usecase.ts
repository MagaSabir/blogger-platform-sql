import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserViewModel } from '../../api/view-dto/user-view-model';
import { UserDbModel } from '../../api/view-dto/user-db-model';
import { BadRequestException } from '@nestjs/common';

export class RegistrationConfirmationCommand {
  constructor(public code: string) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase
  implements ICommandHandler<RegistrationConfirmationCommand>
{
  constructor(private userRepository: UsersRepository) {}

  async execute(command: RegistrationConfirmationCommand) {
    const user: UserDbModel = await this.userRepository.findUserByCode(
      command.code,
    );

    if (!user || user.isConfirmed) {
      throw new BadRequestException({
        errorsMessage: [
          {
            message: 'Email is confirmed or not Found',
            field: 'code',
          },
        ],
      });
    }
    if (command.code !== user.confirmationCode) {
      throw new BadRequestException('confirmation code is incorrect');
    }
    if (user.confirmationCodeExpiration < new Date()) {
      throw new BadRequestException('CodeExpiration');
    }
  }
}
