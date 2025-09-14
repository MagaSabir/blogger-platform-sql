import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersQueryParams } from '../../api/input-dto/users-query-params';

export class UsersQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getUsers(query: UsersQueryParams) {
    const queryD = `
 SELECT * FROM "Users"
 ORDER BY "${query.sortBy}" asc
 LIMIT ${query.pageSize} OFFSET ${query.calculateSkip()}
 `;
    const count = `SELECT COUNT(*) as "totalCount" FROM "Users"`;
    const [items, totalCount] = await Promise.all([
      this.dataSource.query(queryD),
      this.dataSource.query(count),
    ]);
    console.log(query.pageSize);
    console.log(totalCount[0].totalCount);
    return {
      pagesCount: Math.ceil(
        parseInt(totalCount[0].totalCount) / query.pageSize,
      ),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: parseInt(totalCount[0].totalCount),
      items,
    };
  }
}

//pagesCount: Math.ceil(totalCount / query.pageSize)

//(pageNumber - 1) * pageSize
