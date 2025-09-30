import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetBlogsQuery } from '../application/queries/get-blogs.query';
import { GetBlogQuery } from '../application/queries/get-blog.query';
import { BlogsQueryParams } from './input-validation-dto/blogs-query-params';
import { BlogViewModel } from '../application/queries/view-dto/blog.view-model';
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
  async getBlog(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND }),
    )
    id: string,
  ): Promise<BlogViewModel> {
    return await this.queryBus.execute(new GetBlogQuery(id));
  }

  @Get(':id/posts')
  async getPostsByBlogId(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND }),
    )
    id: string,
    @Query() query: PostQueryParams,
  ): Promise<object> {
    return await this.queryBus.execute(new GetAllPostByIdQuery(id, query));
  }
}
