import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { NotFoundException } from '@nestjs/common';

export class UpdateCommentCommand {
  constructor(
    public id: string,
    public content: string,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUserCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: UpdateCommentCommand) {
    const comment = await this.commentsRepository.findComment(command.id);

    if (!comment) throw new NotFoundException();

    await this.commentsRepository.updateComment(command.id, command.content);
  }
}
