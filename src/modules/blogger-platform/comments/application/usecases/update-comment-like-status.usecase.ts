import { LikeStatus } from '../../../posts/application/view-dto/post-view-model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class UpdateCommentLikeStatusCommand {
  constructor(
    public commentId: string,
    public likeStatus: LikeStatus,
  ) {}
}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateCommentLikeStatusUseCase
  implements ICommandHandler<UpdateCommentLikeStatusCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: UpdateCommentLikeStatusCommand) {}
}
