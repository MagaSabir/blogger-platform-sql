import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/api/blogs.controller';
import { GetBlogQueryHandler } from './blogs/application/queries/get-blog.query';
import { GetBlogsQueryHandler } from './blogs/application/queries/get-blogs.query';
import { BlogsQueryRepository } from './blogs/infrastructure/query-repository/blogs.query-repository';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { PostsController } from './posts/api/posts.controller';
import { PostsQueryRepository } from './posts/infrastructure/posts.query-repository';
import { GetAllPostByIdQueryHandler } from './blogs/application/queries/get-all-post-by-id.query';
import { GetAllPostsQueryHandler } from './posts/application/queries/get-all-posts.query';
import { GetPostQueryHandler } from './posts/application/queries/get-post.query';

const commandHandlers = [];
const queryHandlers = [
  GetBlogQueryHandler,
  GetBlogsQueryHandler,
  GetAllPostByIdQueryHandler,
  GetAllPostsQueryHandler,
  GetPostQueryHandler,
];
@Module({
  imports: [CqrsModule],
  providers: [
    ...queryHandlers,
    ...commandHandlers,
    BlogsQueryRepository,
    BlogsRepository,
    PostsQueryRepository,
  ],
  controllers: [BlogsController, PostsController],
})
export class BloggerPlatformModule {}
