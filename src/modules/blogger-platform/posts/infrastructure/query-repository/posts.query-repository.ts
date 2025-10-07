import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostQueryParams } from '../../api/input-dto/post-query-params';
import { PostViewModel } from '../../application/view-dto/post-view-model';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';

export class PostsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAllPosts(
    queryParams: PostQueryParams,
  ): Promise<BasePaginatedResponse<PostViewModel>> {
    const query = `SELECT * FROM "Posts"
                   ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
                   LIMIT $1 OFFSET $2`;

    const count: { totalCount: string }[] = await this.dataSource.query(
      `SELECT COUNT(*) as "totalCount" FROM "Posts"`,
    );
    const posts: PostViewModel[] = await this.dataSource.query(query, [
      queryParams.pageSize,
      queryParams.calculateSkip(),
    ]);
    const totalCount: number = parseInt(count[0].totalCount);
    const items: PostViewModel[] = posts.map((p) => PostViewModel.mapToView(p));

    const i = await this.dataSource.query(`
    SELECT 
    p.id, 
    p.title,
    p."shortDescription",
    p.content, 
    p."blogId",
    p."blogName",
    p."createdAt",
    COUNT(DISTINCT pl.id) as "likesCount",
    COUNT(DISTINCT pd.id) as "dislikesCount",
    (
        SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
                "addedAt", pl2."addedAt",
                "userId", pl2."userId",
                "login", u."login"
            )
        )
        FROM (
            SELECT "addedAt", "userId"
            FROM "PostLikes" 
            WHERE "postId" = p.id AND status = 'Like'
            ORDER BY "addedAt" DESC
            LIMIT 3
        ) pl2
        LEFT JOIN "Users" u ON pl2."userId" = u.id
    ) as "extendedLikesInfo"
FROM "Posts" p
LEFT JOIN "PostLikes" pl ON p.id = pl."postId" AND pl.status = 'Like'
LEFT JOIN "PostLikes" pd ON p.id = pd."postId" AND pd.status = 'Dislike'
GROUP BY p.id, p.title, p."shortDescription", p.content, p."blogId", p."blogName", p."createdAt"
    `);

    console.log(JSON.stringify(i, null, 2));

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items,
    };
  }

  async getPost(id: string): Promise<PostViewModel | null> {
    const result: PostViewModel[] = await this.dataSource.query(
      `SELECT * FROM "Posts" WHERE id = $1`,
      [id],
    );
    if (!result[0]) return null;
    return PostViewModel.mapToView(result[0]);
  }

  async getBlogPosts(
    queryParams: PostQueryParams,
    blogId: string,
  ): Promise<BasePaginatedResponse<PostViewModel>> {
    const query = `SELECT * FROM "Posts" WHERE "blogId" = $1
                   ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
                   LIMIT $2 OFFSET $3`;

    const count: { totalCount: string }[] = await this.dataSource.query(
      `SELECT COUNT(*) as "totalCount" FROM "Posts" WHERE "blogId" = $1`,
      [blogId],
    );
    const posts: PostViewModel[] = await this.dataSource.query(query, [
      blogId,
      queryParams.pageSize,
      queryParams.calculateSkip(),
    ]);
    const totalCount: number = parseInt(count[0].totalCount);
    const items: PostViewModel[] = posts.map((p) => PostViewModel.mapToView(p));
    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items,
    };
  }
}
