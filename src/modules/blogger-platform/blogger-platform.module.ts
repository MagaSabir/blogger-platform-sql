import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/api/blogs.controller';
import { GetBlogQueryHandler } from './blogs/application/queries/get-blog.query';
import { GetBlogsQueryHandler } from './blogs/application/queries/get-blogs.query';
import { BlogsQueryRepository } from './blogs/infrastructure/query-repository/blogs.query-repository';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { CqrsModule } from '@nestjs/cqrs';

const commandHandlers = [];
const queryHandlers = [GetBlogQueryHandler, GetBlogsQueryHandler];
@Module({
  imports: [CqrsModule],
  providers: [
    ...queryHandlers,
    ...commandHandlers,
    BlogsQueryRepository,
    BlogsRepository,
  ],
  controllers: [BlogsController],
})
export class BloggerPlatformModule {}
