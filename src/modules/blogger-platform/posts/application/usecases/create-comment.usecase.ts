import { PostCommentInputDto } from '../../api/input-dto/post-comment.input.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../comments/infrastructure/comments.repository';

export class CreateCommentCommand {
  constructor(
    public id: string,
    public dto: PostCommentInputDto,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: CreateCommentCommand) {}
}
