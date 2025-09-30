import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BlogsQueryParams } from '../input-validation-dto/blogs-query-params';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';
import { GetBlogsQuery } from '../../application/queries/get-blogs.query';
import { BlogViewModel } from '../../application/queries/view-dto/blog.view-model';
import { BasicAuthGuard } from '../../../../user-accounts/guards/basic/basic-auth.guard';
import { CreateBlogInputDto } from '../input-validation-dto/create-blog-input-dto';
import { CreateBlogCommand } from '../../application/usecases/create-blog.usecase';
import { UpdateBlogCommand } from '../../application/usecases/update-blog.usecase';
import { DeleteBlogCommand } from '../../application/usecases/delete-blog.usecase';
import { CreatePostInputDto } from '../input-validation-dto/create-post-input-dto';
import { CreatePostByBlogIdCommand } from '../../application/usecases/create-post-by-blog-id.usecase';
import { PostViewModel } from '../../../posts/application/view-dto/post-view-model';

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
export class SaBlogsController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @Get()
  async getAllBlogs(
    @Query() query: BlogsQueryParams,
  ): Promise<BasePaginatedResponse<BlogViewModel>> {
    return this.queryBus.execute(new GetBlogsQuery(query));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() body: CreateBlogInputDto): Promise<BlogViewModel> {
    return this.commandBus.execute(new CreateBlogCommand(body));
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND }),
    )
    id: string,
    @Body() dto: CreateBlogInputDto,
  ): Promise<void> {
    await this.commandBus.execute(new UpdateBlogCommand(dto, id));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND }),
    )
    id: string,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteBlogCommand(id));
  }

  @Post(':id/posts')
  @HttpCode(HttpStatus.CREATED)
  async createPostByBlogId(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND }),
    )
    id: string,
    @Body() body: CreatePostInputDto,
  ): Promise<PostViewModel> {
    return this.commandBus.execute(new CreatePostByBlogIdCommand(body, id));
  }
}
