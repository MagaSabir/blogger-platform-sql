import { CreatePostByBlogId } from '../../dto/create-post-by-blog-id.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { NotFoundException } from '@nestjs/common';

export class CreatePostByBlogIdCommand {
  constructor(
    public dto: CreatePostByBlogId,
    public id: string,
  ) {}
}

@CommandHandler(CreatePostByBlogIdCommand)
export class CreatePostByBlogIdUseCase
  implements ICommandHandler<CreatePostByBlogIdCommand>
{
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: CreatePostByBlogIdCommand) {
    const blog = await this.blogsRepository.findBlog(command.id);
    if (!blog) throw new NotFoundException();
    return this.blogsRepository.createPostByBlogId(
      command.dto,
      command.id,
      blog.name,
    );
  }
}
