import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../infrastructure/query-repository/blogs.query-repository';

export class GetBlogQuery {
  constructor(public id: string) {}
}

@QueryHandler(GetBlogQuery)
export class GetBlogQueryHandler implements IQueryHandler<GetBlogQuery> {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async execute(query: GetBlogQuery) {
    return this.blogsQueryRepository.getBlog(query.id);
  }
}
