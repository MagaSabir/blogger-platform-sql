import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class BlogsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
}
