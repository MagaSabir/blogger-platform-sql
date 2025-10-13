import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LikeStatus } from '../../../posts/application/view-dto/post-view-model';
import { PostLikeType } from '../dto/post-like-type';

export class LikesRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async updateCommentLikeStatus(commentId: string, likeStatus: LikeStatus) {}

  async finUserLikeByPostId(
    id: string,
    userId: string,
  ): Promise<PostLikeType | null> {
    const result: PostLikeType[] = await this.dataSource.query(
      `
    SELECT * FROM "PostLikes" WHERE "postId" = $1 AND "userId" = $2
    `,
      [id, userId],
    );
    return result[0] ?? null;
  }

  async setPostLike(id: string, userId: string, status: LikeStatus) {
    const result = await this.dataSource.query(
      `
    UPDATE "PostLikes" SET status = $3, "addedAt" = now() WHERE "postId" = $1 AND "userId" = $2
    `,
      [id, userId, status],
    );
  }

  async setNewPostLike(id: string, userId: string, status: LikeStatus) {
    await this.dataSource.query(
      `INSERT INTO "PostLikes" ("postId", "userId", status)
    VALUES ($1, $2, $3)`,
      [id, userId, status],
    );
  }
}
