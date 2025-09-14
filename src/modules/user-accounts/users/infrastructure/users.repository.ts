import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserViewModel } from '../api/view-dto/user-view-model';
import { UserDbModel } from '../api/view-dto/user-db-model';
import { CreateUserType } from '../application/usecase/admins/create-user.usecase';

export class UsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createUser(dto: CreateUserType): Promise<UserViewModel> {
    try {
      const query = `
          INSERT INTO "Users" ("login", "passwordHash", "email")
          VALUES ($1, $2, $3) RETURNING id, login, email, "createdAt"
      `;
      const result: UserViewModel[] = await this.dataSource.query(query, [
        dto.login,
        dto.passwordHash,
        dto.email,
      ]);
      return result[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('User already exists');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteUserById(id: number) {
    const query = `DELETE FROM "Users" WHERE id = $1`;
    await this.dataSource.query(query, [id]);
  }

  async findUserByLogin(login: string): Promise<UserDbModel> {
    const query = `SELECT * FROM "Users" WHERE login = $1`;
    return this.dataSource.query(query, [login]);
  }
}
