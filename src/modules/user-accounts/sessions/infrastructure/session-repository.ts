import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class SessionRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createSession(dto) {
    await this.dataSource.query(``);
  }
}
