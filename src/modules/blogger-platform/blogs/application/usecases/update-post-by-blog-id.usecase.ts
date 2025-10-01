import { CreatePostByBlogId } from '../../dto/create-post-by-blog-id.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { NotFoundException } from '@nestjs/common';
import { BlogViewModel } from '../queries/view-dto/blog.view-model';

export class UpdatePostByBlogIdCommand {
  constructor(
    public dto: CreatePostByBlogId,
    public params: { blogId: string; postId: string },
  ) {}
}

@CommandHandler(UpdatePostByBlogIdCommand)
export class UpdatePostByBlogIdUseCase
  implements ICommandHandler<UpdatePostByBlogIdCommand>
{
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}
  async execute(command: UpdatePostByBlogIdCommand): Promise<void> {
    const blog: BlogViewModel | null = await this.blogsRepository.findBlog(
      command.params.blogId,
    );
    if (!blog) throw new NotFoundException();

    return this.postsRepository.updatePostByBlogId(
      command.dto,
      command.params.postId,
      blog.id,
    );
  }
}
