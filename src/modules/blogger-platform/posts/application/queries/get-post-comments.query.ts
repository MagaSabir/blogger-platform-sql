import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../comments/infrastructure/comments.repository';

export class GetPostCommentsQuery {
  constructor(
    public id: string,
    public userId: string,
  ) {}
}

@QueryHandler(GetPostCommentsQuery)
export class GetPostCommentsQueryHandler
  implements IQueryHandler<GetPostCommentsQuery>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(query: GetPostCommentsQuery) {}
}
