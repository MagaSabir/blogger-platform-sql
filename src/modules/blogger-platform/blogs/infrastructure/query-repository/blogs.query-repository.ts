import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogsQueryParams } from '../../api/input-validation-dto/blogs-query-params';

export class BlogsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getBlogs(queryParams: BlogsQueryParams): Promise<object> {
    const query = `SELECT * FROM "Blogs"
                    WHERE ($1::text IS NULL OR name ILIKE '%' || $1 || '%')
                    ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
                    LIMIT $2 OFFSET $3`;

    const count = `
    SELECT COUNT(*) as "totalCount" FROM "Blogs" WHERE ($1::text IS NULL OR name ILIKE '%' || $1 || '%')`;

    const [items, totalCountResult] = await Promise.all([
      this.dataSource.query(query, [
        queryParams.searchNameTerm,
        queryParams.pageNumber,
        queryParams.calculateSkip(),
      ]),
      this.dataSource.query<{ totalCount: number }>(count, [
        queryParams.searchNameTerm,
      ]),
    ]);

    const totalCount: number = parseInt(totalCountResult[0].totalCount);
    console.log(totalCount);

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items,
    };
  }

  async getBlog(id: string): Promise<object> {
    const query = `SELECT * FROM "Blogs" WHERE id = $1`;
    return this.dataSource.query(query, [id]);
  }
}
