import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../infrastructure/query-repository/blogs.query-repository';
import { PostQueryParams } from '../../../posts/api/input-dto/post-query-params';

export class GetAllPostByIdQuery {
  constructor(
    public id: string,
    public queryParams: PostQueryParams,
  ) {}
}

@QueryHandler(GetAllPostByIdQuery)
export class GetAllPostByIdQueryHandler
  implements IQueryHandler<GetAllPostByIdQuery>
{
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async execute(query: GetAllPostByIdQuery) {
    return this.blogsQueryRepository.getAllPostsById(
      query.id,
      query.queryParams,
    );
  }
}
