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
    const items: PostViewModel[] = await this.dataSource.query(query, [
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

  async getPost(id: string): Promise<PostViewModel> {
    const result: PostViewModel[] = await this.dataSource.query(
      `SELECT * FROM "Posts" WHERE id = $1`,
      [id],
    );
    return result[0] ?? null;
  }
}
