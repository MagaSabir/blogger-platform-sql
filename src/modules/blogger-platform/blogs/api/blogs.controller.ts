import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetBlogsQuery } from '../application/queries/get-blogs.query';
import { GetBlogQuery } from '../application/queries/get-blog.query';
import { BlogsQueryParams } from './input-validation-dto/blogs-query-params';
import { BlogViewModel } from '../application/queries/view-dto/blog.view-model';
import { InputIdValidation } from './input-validation-dto/input-id-validation';
import { BasePaginatedResponse } from '../../../../core/base-paginated-response';
import { GetAllPostByIdQuery } from '../application/queries/get-all-post-by-id.query';
import { PostQueryParams } from '../../posts/api/input-dto/post-query-params';

@Controller('blogs')
export class BlogsController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  async getBlogs(
    @Query() query: BlogsQueryParams,
  ): Promise<BasePaginatedResponse<BlogViewModel>> {
    return await this.queryBus.execute(new GetBlogsQuery(query));
  }

  @Get(':id')
  async getBlog(@Param() params: InputIdValidation): Promise<BlogViewModel> {
    return await this.queryBus.execute(new GetBlogQuery(params.id));
  }

  @Get(':id/posts')
  async getPostsByBlogId(
    @Param() params: InputIdValidation,
    @Query() query: PostQueryParams,
  ): Promise<object> {
    return await this.queryBus.execute(
      new GetAllPostByIdQuery(params.id, query),
    );
  }
}
