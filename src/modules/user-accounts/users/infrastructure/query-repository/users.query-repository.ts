import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersQueryParams } from '../../api/input-dto/users-query-params';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';
import { UserViewModel } from '../../api/view-dto/user-view-model';

export class UsersQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getUsers(
    query: UsersQueryParams,
  ): Promise<BasePaginatedResponse<UserViewModel>> {
    const queryD = `
        SELECT id::text, login, email, "createdAt"
        FROM "Users"
        WHERE ($1::text IS NULL OR login ILIKE '%' || $1 || '%')
           OR ($2::text IS NULL OR email ILIKE '%' || $2 || '%')
        ORDER BY LOWER("${query.sortBy}") ${query.sortDirection}
    LIMIT $3 OFFSET $4
    `;

    const count = `
        SELECT COUNT(*) as "totalCount"
        FROM "Users"
        WHERE ($1::text IS NULL OR login ILIKE '%' || $1 || '%')
           OR ($2::text IS NULL OR email ILIKE '%' || $2 || '%')
    `;

    const [items, totalCountResult] = await Promise.all([
      this.dataSource.query<UserViewModel[]>(queryD, [
        query.searchLoginTerm,
        query.searchEmailTerm,
        query.pageSize,
        query.calculateSkip(),
      ]),
      this.dataSource.query<{ totalCount: string }>(count, [
        query.searchLoginTerm,
        query.searchEmailTerm,
      ]),
    ]);
    const totalCount: number = parseInt(totalCountResult[0].totalCount);

    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    };
  }
}

//pagesCount: Math.ceil(totalCount / query.pageSize)

//(pageNumber - 1) * pageSize
