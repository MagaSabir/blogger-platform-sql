import { Body, Controller, Param } from '@nestjs/common';
import { UpdateCommentLikeStatusCommand } from '../application/usecases/update-comment-like-status.usecase';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LikeStatus } from '../../posts/application/view-dto/post-view-model';

@Controller('comments')
export class CommentsController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  async updateCommentLike(@Param('id') id: string, @Body() status: LikeStatus) {
    return this.commandBus.execute(
      new UpdateCommentLikeStatusCommand(id, status),
    );
  }
}
