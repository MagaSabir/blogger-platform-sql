import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PostQueryParams } from './input-dto/post-query-params';
import { GetAllPostsQuery } from '../application/queries/get-all-posts.query';
import { BasePaginatedResponse } from '../../../../core/base-paginated-response';
import { PostViewModel } from '../application/view-dto/post-view-model';
import { GetPostQuery } from '../application/queries/get-post.query';
import { CurrentUserId } from '../../../../core/decorators/current-user-id';
import { JwtOptionalAuthGuard } from '../../../user-accounts/guards/bearer/jwt-optional-auth.guard';
import { JwtAuthGuard } from '../../../user-accounts/guards/bearer/jwt-auth.guard';
import { PostCommentInputDto } from './input-dto/post-comment.input.dto';
import { CreateCommentCommand } from '../application/usecases/create-comment.usecase';
import { GetPostCommentsQuery } from '../application/queries/get-post-comments.query';
import { LikeStatusInputDto } from './input-dto/like-input.dto';
import { PostSetLikeCommand } from '../application/usecases/post.set-like.usecase';

@Controller('posts')
export class PostsController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

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
  async getPost(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
  ): Promise<PostViewModel> {
    return this.queryBus.execute(new GetPostQuery(id, userId));
  }

  @Get(':id/comments')
  @UseGuards(JwtOptionalAuthGuard)
  async getPostComments(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
  ) {
    return this.queryBus.execute(new GetPostCommentsQuery(id, userId));
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('id') id: string,
    @Body() dto: PostCommentInputDto,
  ) {
    return this.commandBus.execute(new CreateCommentCommand(id, dto));
  }

  @Put(':id/like-status')
  @UseGuards(JwtAuthGuard)
  async setLike(
    @Param('id') id: string,
    @Body() dto: LikeStatusInputDto,
    @CurrentUserId() userId: string,
  ) {
    await this.commandBus.execute(
      new PostSetLikeCommand(id, dto.likeStatus, userId),
    );
  }
}
