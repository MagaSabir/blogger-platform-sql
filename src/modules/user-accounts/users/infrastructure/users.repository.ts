import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';

export class UsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createUser(dto: CreateUserDto) {
    try {
      const query = `
          INSERT INTO "Users" ("Login", "Password", "Email")
          VALUES ($1, $2, $3) RETURNING "Id", "Login", "Email", "CreatedAt"
      `;
      const result = await this.dataSource.query(query, [
        dto.login,
        dto.password,
        dto.email,
      ]);

      return result[0];
    } catch (error) {
      throw new BadRequestException('User with this email already exists');
    }
  }
}
