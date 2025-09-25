import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Controller('blogs')
export class BlogsController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  async getBlogs() {}

  async getBlog() {}

  async getPostsByBlogId() {}
}
