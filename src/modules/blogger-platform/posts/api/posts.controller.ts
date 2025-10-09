import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PostQueryParams } from './input-dto/post-query-params';
import { GetAllPostsQuery } from '../application/queries/get-all-posts.query';
import { BasePaginatedResponse } from '../../../../core/base-paginated-response';
import { PostViewModel } from '../application/view-dto/post-view-model';
import { GetPostQuery } from '../application/queries/get-post.query';
import { CurrentUserId } from '../../../../core/decorators/current-user-id';
import { JwtOptionalAuthGuard } from '../../../user-accounts/guards/bearer/jwt-optional-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  @UseGuards(JwtOptionalAuthGuard)
  async getPosts(
    @Query() query: PostQueryParams,
    @CurrentUserId() userId: string,
  ): Promise<BasePaginatedResponse<PostViewModel[]>> {
    return this.queryBus.execute(new GetAllPostsQuery(query, userId));
  }

  @Get(':id')
  @UseGuards(JwtOptionalAuthGuard)
  async getPost(@Param('id') id: string): Promise<PostViewModel> {
    return this.queryBus.execute(new GetPostQuery(id));
  }
}
