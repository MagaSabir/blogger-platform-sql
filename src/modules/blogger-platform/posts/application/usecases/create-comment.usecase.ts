import { PostCommentInputDto } from '../../api/input-dto/post-comment.input.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../comments/infrastructure/comments.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { NotFoundException } from '@nestjs/common';
import { CommentsQueryRepository } from '../../../comments/infrastructure/comments.query-repository';
import { CommentViewModel } from '../../../comments/api/view-models/comment-view-model';
import { PostViewModel } from '../view-dto/post-view-model';

export class CreateCommentCommand {
  constructor(
    public id: string,
    public dto: PostCommentInputDto,
    public userId: string,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private commentsRepository: CommentsRepository,
    private postsRepository: PostsRepository,
    private commentQueryRepository: CommentsQueryRepository,
  ) {}

  async execute(command: CreateCommentCommand): Promise<CommentViewModel> {
    const post: PostViewModel | null = await this.postsRepository.findPost(
      command.id,
    );

    if (!post) throw new NotFoundException();
    const id: string = await this.commentsRepository.createComment(
      command.dto.content,
      command.id,
      command.userId,
    );

    return this.commentQueryRepository.getComment(id, command.userId);
  }
}
