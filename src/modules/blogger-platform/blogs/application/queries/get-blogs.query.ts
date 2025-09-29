import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../infrastructure/query-repository/blogs.query-repository';
import { BlogsQueryParams } from '../../api/input-validation-dto/blogs-query-params';

export class GetBlogsQuery {
  constructor(public queryParams: BlogsQueryParams) {}
}

@QueryHandler(GetBlogsQuery)
export class GetBlogsQueryHandler implements IQueryHandler<GetBlogsQuery> {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async execute(query: GetBlogsQuery) {
    return this.blogsQueryRepository.getBlogs(query.queryParams);
  }
}
