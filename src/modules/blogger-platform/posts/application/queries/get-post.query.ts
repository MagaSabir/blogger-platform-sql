import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../../infrastructure/posts.query-repository';
import { PostViewModel } from '../view-dto/post-view-model';
import { NotFoundException } from '@nestjs/common';

export class GetPostQuery {
  constructor(public id: string) {}
}

@QueryHandler(GetPostQuery)
export class GetPostQueryHandler implements IQueryHandler<GetPostQuery> {
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  async execute(query: GetPostQuery) {
    const result: PostViewModel = await this.postsQueryRepository.getPost(
      query.id,
    );
    if (!result) throw new NotFoundException();

    return result;
  }
}
