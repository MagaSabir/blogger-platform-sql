import { Controller, Get, Param, Req } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetBlogsQuery } from '../application/queries/get-blogs.query';
import { GetBlogQuery } from '../application/queries/get-blog.query';
import { Request } from 'express';

@Controller('blogs')
export class BlogsController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @Get()
  async getBlogs(@Req() request: Request): Promise<object> {
    console.log(request.httpVersion);
    return await this.queryBus.execute(new GetBlogsQuery());
  }

  @Get(':id')
  async getBlog(@Param('id') blogId: string): Promise<object> {
    return await this.queryBus.execute(new GetBlogQuery(blogId));
  }

  @Get()
  async getPostsByBlogId() {}
}
