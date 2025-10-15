import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentsQueryRepository } from '../../infrastructure/comments.query-repository';
import { CommentViewModel } from '../../api/view-models/comment-view-model';

export class GetPostCommentQuery {
  constructor(
    public id: string,
    public userId: string,
  ) {}
}

@QueryHandler(GetPostCommentQuery)
export class GetPostCommentQueryHandler
  implements IQueryHandler<GetPostCommentQuery>
{
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  async execute(query: GetPostCommentQuery): Promise<CommentViewModel> {
    return this.commentsQueryRepository.getComment(query.id, query.userId);
  }
}
