import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class BlogsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getBlogs(): Promise<object> {
    const query = `SELECT * FROM "Blogs"`;
    return this.dataSource.query(query);
  }

  async getBlog(id: string): Promise<object> {
    const query = `SELECT * FROM "Blogs" WHERE id = $1`;
    return this.dataSource.query(query, [id]);
  }
}
