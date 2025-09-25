import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetBlogQuery {
  constructor() {}
}

@QueryHandler(GetBlogQuery)
export class GetBlogQueryHandler implements IQueryHandler<GetBlogQuery> {
  constructor() {}

  async execute() {}
}
