import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateBlogDto } from '../dto/create-blog-dto';
import { BlogViewModel } from '../application/queries/view-dto/blog.view-model';
import { CreateBlogInputDto } from '../api/input-validation-dto/create-blog-input-dto';
import { CreatePostByBlogId } from '../dto/create-post-by-blog-id.dto';
import { PostViewModel } from '../../posts/application/view-dto/post-view-model';

export class BlogsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findBlog(id: string): Promise<BlogViewModel | null> {
    const result: BlogViewModel[] = await this.dataSource.query(
      `SELECT *
       FROM "Blogs"
       WHERE id = $1`,
      [id],
    );
    return result[0] ?? null;
  }

  async createBlog(dto: CreateBlogDto): Promise<BlogViewModel> {
    const result: BlogViewModel[] = await this.dataSource.query(
      `INSERT INTO "Blogs" (name, description, "websiteUrl")
       VALUES ($1, $2, $3)
       RETURNING *`,
      [dto.name, dto.description, dto.websiteUrl],
    );

    return result[0] ?? null;
  }

  async updateBlog(dto: CreateBlogInputDto, id: string) {
    const query = `UPDATE "Blogs"
    set name = $1,
        description = $2,
        "websiteUrl" = $3
    WHERE id = $4`;
    await this.dataSource.query(query, [
      dto.name,
      dto.description,
      dto.websiteUrl,
      id,
    ]);
  }

  async deleteBlog(id: string) {
    await this.dataSource.query(`DELETE FROM "Blogs" WHERE id = $1`, [id]);
  }

  async createPostByBlogId(
    dto: CreatePostByBlogId,
    blogId: string,
    blogName: string,
  ): Promise<PostViewModel> {
    const result: PostViewModel[] = await this.dataSource.query(
      `INSERT INTO "Posts" (title, "shortDescription", content, "blogId", "blogName")
      VALUES  ($1, $2, $3, $4, $5)
      RETURNING *`,
      [dto.title, dto.shortDescription, dto.content, blogId, blogName],
    );
    return result[0] ?? null;
  }
}
