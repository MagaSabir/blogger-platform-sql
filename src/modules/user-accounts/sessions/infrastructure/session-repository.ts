import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateSessionDto } from '../dto/CreateSessionDto';
import { TokenPayloadType } from '../../types/token-payload-type';
import { SessionsType } from '../type/sessions-type';
import { NotFoundException } from '@nestjs/common';

export class SessionRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createSession(dto: CreateSessionDto) {
    const query = `
    INSERT INTO "Sessions" ("userId", "deviceId", "userAgent", "ip", "lastActiveDate", "expiresAt")
    VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await this.dataSource.query(query, [
      dto.userId,
      dto.deviceId,
      dto.userAgent,
      dto.ip,
      dto.lastActiveDate,
      dto.expiresAt,
    ]);
  }

  async updateSessionToken(payload: TokenPayloadType) {
    const { userId, deviceId, iat, exp } = payload;
    const query = `UPDATE "Sessions" SET "lastActiveDate" = to_timestamp($1), "expiresAt" = to_timestamp($2) 
                  WHERE "userId" = $3 AND "deviceId" = $4`;
    await this.dataSource.query(query, [iat, exp, userId, deviceId]);
  }

  async findSession(
    userId: string,
    deviceId: string,
  ): Promise<SessionsType | null> {
    const session: SessionsType[] = await this.dataSource.query(
      `SELECT * FROM "Sessions" WHERE "userId" = $1 AND "deviceId" = $2`,
      [userId, deviceId],
    );
    return session[0] ?? null;
  }

  async deleteSession(userId: string, deviceId: string) {
    await this.dataSource.query(
      `DELETE FROM "Sessions" WHERE "userId" = $1 AND "deviceId" = $2`,
      [userId, deviceId],
    );
  }

  async getDeviceSession(userId: string, now: number): Promise<SessionsType[]> {
    const session: SessionsType[] = await this.dataSource.query(
      `SELECT ip, "userAgent" as title, "lastActiveDate", "deviceId" FROM "Sessions" WHERE "userId" = $1 AND "expiresAt" > to_timestamp($2)`,
      [userId, now],
    );
    return session;
  }

  async deleteOtherActiveSessions(userId: string, deviceId: string) {
    await this.dataSource.query(
      `DELETE FROM "Sessions" WHERE "userId" = $1 AND "deviceId" != $2
`,
      [userId, deviceId],
    );
  }

  async deleteSessionByDeviceId(deviceId: string) {
    await this.dataSource.query(
      `DELETE FROM "Sessions" WHERE "deviceId" = $1`,
      [deviceId],
    );
  }

  async findSessionOrThrowNotFoundException(deviceId: string) {
    const result: SessionsType[] = await this.dataSource.query(
      `SELECT * FROM "Sessions" WHERE "deviceId" = $1`,
      [deviceId],
    );
    if (!result[0]) throw new NotFoundException();
    return result[0];
  }
}
