import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetBlogsQuery } from '../application/queries/get-blogs.query';
import { GetBlogQuery } from '../application/queries/get-blog.query';
import { Request } from 'express';
import { BlogsQueryParams } from './input-validation-dto/blogs-query-params';
import { BlogViewModel } from '../../../user-accounts/users/application/queries/view-dto/blog.view-model';

@Controller('blogs')
export class BlogsController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @Get()
  async getBlogs(@Query() query: BlogsQueryParams): Promise<BlogViewModel> {
    return await this.queryBus.execute(new GetBlogsQuery(query));
  }

  @Get(':id')
  async getBlog(@Param('id') blogId: string): Promise<object> {
    return await this.queryBus.execute(new GetBlogQuery(blogId));
  }

  @Get()
  async getPostsByBlogId() {}
}
