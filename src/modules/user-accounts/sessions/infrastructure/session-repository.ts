import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateSessionDto } from '../dto/CreateSessionDto';

export class SessionRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createSession(dto: CreateSessionDto) {
    const query = `
    INSERT INTO "Sessions" ("userId", "deviceId", "userAgent", "ip", "lastActiveDate", "expiresAt")
    VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const result = await this.dataSource.query(query, [
      dto.userId,
      dto.deviceId,
      dto.userAgent,
      dto.ip,
      dto.lastActiveDate,
      dto.expiresAt,
    ]);
  }
}
