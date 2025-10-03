import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class CommentsQueryRepository {
  constructor(@InjectDataSource() dataSource: DataSource) {}

  async getComment(id: string) {}
}
