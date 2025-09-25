import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetBlogsQuery {
  constructor() {}
}

@QueryHandler(GetBlogsQuery)
export class GetBlogsQueryHandler implements IQueryHandler<GetBlogsQuery> {
  constructor() {}

  async execute() {}
}
