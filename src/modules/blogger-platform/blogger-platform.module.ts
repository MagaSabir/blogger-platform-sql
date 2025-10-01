import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/api/blogs.controller';
import { GetBlogQueryHandler } from './blogs/application/queries/get-blog.query';
import { GetBlogsQueryHandler } from './blogs/application/queries/get-blogs.query';
import { BlogsQueryRepository } from './blogs/infrastructure/query-repository/blogs.query-repository';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { PostsController } from './posts/api/posts.controller';
import { PostsQueryRepository } from './posts/infrastructure/query-repository/posts.query-repository';
import { GetAllPostByIdQueryHandler } from './blogs/application/queries/get-all-post-by-id.query';
import { GetAllPostsQueryHandler } from './posts/application/queries/get-all-posts.query';
import { GetPostQueryHandler } from './posts/application/queries/get-post.query';
import { SaBlogsController } from './blogs/api/admin/sa.blogs.controller';
import { CreateBlogUseCase } from './blogs/application/usecases/create-blog.usecase';
import { UpdateBlogUseCase } from './blogs/application/usecases/update-blog.usecase';
import { DeleteBlogUseCase } from './blogs/application/usecases/delete-blog.usecase';
import { CreateBlogPostUseCase } from './blogs/application/usecases/create-blog-post-use.case';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { UpdateBlogPostUseCase } from './blogs/application/usecases/update-blog-post-use.case';
import { GetBlogPostsQueryHandler } from './blogs/application/queries/get-blog-posts.query';
import { DeleteBlogPostUseCase } from './blogs/application/usecases/delete-blog-post.usecase';

const commandHandlers = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreateBlogPostUseCase,
  UpdateBlogPostUseCase,
  DeleteBlogPostUseCase,
];
const queryHandlers = [
  GetBlogQueryHandler,
  GetBlogsQueryHandler,
  GetAllPostByIdQueryHandler,
  GetAllPostsQueryHandler,
  GetPostQueryHandler,
  GetBlogPostsQueryHandler,
];
@Module({
  imports: [CqrsModule],
  providers: [
    ...queryHandlers,
    ...commandHandlers,
    BlogsQueryRepository,
    BlogsRepository,
    PostsQueryRepository,
    BlogsRepository,
    PostsRepository,
  ],
  controllers: [BlogsController, PostsController, SaBlogsController],
})
export class BloggerPlatformModule {}
