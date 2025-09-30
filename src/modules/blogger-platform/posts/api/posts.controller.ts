import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PostQueryParams } from './input-dto/post-query-params';
import { GetAllPostsQuery } from '../application/queries/get-all-posts.query';
import { BasePaginatedResponse } from '../../../../core/base-paginated-response';
import { PostViewModel } from '../application/view-dto/post-view-model';
import { GetPostQuery } from '../application/queries/get-post.query';

@Controller('posts')
export class PostsController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  async getPosts(
    @Query() query: PostQueryParams,
  ): Promise<BasePaginatedResponse<PostViewModel[]>> {
    return this.queryBus.execute(new GetAllPostsQuery(query));
  }

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<PostViewModel> {
    return this.queryBus.execute(new GetPostQuery(id));
  }
}
