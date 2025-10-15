import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentViewModel } from '../api/view-models/comment-view-model';

export class CommentsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async updateComment(commentId: string, content: string) {
    await this.dataSource.query(
      `
    UPDATE "Comments" SET content = $1 WHERE id = $2
    `,
      [content, commentId],
    );
  }

  async deleteComment(commentId: string) {
    await this.dataSource.query(
      `
    DELETE FROM "Comments" WHERE id = $1
    `,
      [commentId],
    );
  }

  async createComment(
    content: string,
    postId: string,
    userId: string,
  ): Promise<string> {
    const result: [{ id: string }] = await this.dataSource.query(
      `
    INSERT INTO "Comments" (content, "postId", "userId")
    VALUES ($1, $2, $3)
    RETURNING id
    `,
      [content, postId, userId],
    );

    return result[0].id;
  }

  async findComment(id: string): Promise<CommentViewModel | null> {
    const result: CommentViewModel[] = await this.dataSource.query(
      `SELECT * FROM "Comments" WHERE id = $1`,
      [id],
    );
    return result[0] ?? null;
  }
}
