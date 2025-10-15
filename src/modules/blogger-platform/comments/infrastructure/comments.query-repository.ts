import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentViewModel } from '../api/view-models/comment-view-model';
import { CommentQueryParams } from '../input-dto/comment-query-params';
import { BasePaginatedResponse } from '../../../../core/base-paginated-response';

export class CommentsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getComment(id: string, userId?: string): Promise<CommentViewModel> {
    const result: CommentViewModel[] = await this.dataSource.query(
      `
        SELECT ps.id,
               ps.content,
               JSONB_BUILD_OBJECT(
                       'userId', ps."userId",
                       'userLogin', u.login
               ) as "commentatorInfo",
               ps."createdAt",
               JSON_BUILD_OBJECT(
                       'likesCount',
                       (SELECT COUNT(*) FROM "CommentLikes" c WHERE ps.id = c."commentId" AND c.status = 'Like'),
                       'dislikesCount',
                       (SELECT COUNT(*) FROM "CommentLikes" c WHERE ps.id = c."commentId" AND c.status = 'Dislike'),
                       'myStatus',
                       COALESCE((SELECT c.status FROM "CommentLikes" c WHERE ps.id = c."commentId" AND c."userId" = $2),
                                'None')
               ) as "likeInfo"
        FROM "Comments" ps
                 LEFT JOIN "Users" u ON u.id = ps."userId"
        WHERE ps."id" = $1
    `,
      [id, userId],
    );
    return result[0] ?? null;
  }

  async getComments(
    queryParams: CommentQueryParams,
    userId?: string,
  ): Promise<BasePaginatedResponse<CommentViewModel>> {
    const query = `
    SELECT ps.id,
               ps.content,
               JSONB_BUILD_OBJECT(
                       'userId', ps."userId",
                       'userLogin', u.login
               ) as "commentatorInfo",
               ps."createdAt",
               JSON_BUILD_OBJECT(
                       'likesCount',
                       (SELECT COUNT(*) FROM "CommentLikes" c WHERE ps.id = c."commentId" AND c.status = 'Like'),
                       'dislikesCount',
                       (SELECT COUNT(*) FROM "CommentLikes" c WHERE ps.id = c."commentId" AND c.status = 'Dislike'),
                       'myStatus',
                       COALESCE((SELECT c.status FROM "CommentLikes" c WHERE ps.id = c."commentId" AND c."userId" = $1),
                                'None')
               ) as "likeInfo"
        FROM "Comments" ps
                 LEFT JOIN "Users" u ON u.id = ps."userId"
    ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
    LIMIT $2 OFFSET $3
    `;

    const count: { totalCount: string }[] = await this.dataSource.query(
      `SELECT COUNT(*) as "totalCount" FROM "Comments"`,
    );

    const items: CommentViewModel[] = await this.dataSource.query(query, [
      userId,
      queryParams.pageSize,
      queryParams.calculateSkip(),
    ]);
    const totalCount: number = parseInt(count[0].totalCount);

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items,
    };
  }
}
