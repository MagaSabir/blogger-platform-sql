import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserViewModel } from '../api/view-dto/user-view-model';
import { UserDbModel } from '../api/view-dto/user-db-model';
import { CreateUserType } from '../../types/create-user-type';
@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createUser(dto: CreateUserType): Promise<UserViewModel> {
    try {
      const query = `
            INSERT INTO "Users" ("login", "passwordHash", "email", "isConfirmed")
            VALUES ($1, $2, $3, $4) RETURNING id, login, email, "createdAt"
        `;
      const result: UserViewModel[] = await this.dataSource.query(query, [
        dto.login,
        dto.passwordHash,
        dto.email,
        dto.isConfirmed,
      ]);
      const user = result[0];
      return { ...user, id: user.id.toString() };
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('User already exists');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteUserById(id: number): Promise<void> {
    const query = `DELETE FROM "Users" WHERE id = $1`;
    await this.dataSource.query(query, [id]);
  }

  async findUserByLoginOrEmailForAuth(
    loginOrEmail: string,
  ): Promise<UserDbModel | null> {
    const query = `SELECT * FROM "Users" WHERE login = $1 OR email = $2`;
    const result: UserDbModel[] = await this.dataSource.query(query, [
      loginOrEmail,
      loginOrEmail,
    ]);
    return result.length ? result[0] : null;
  }

  async findUserOrThrowNotFound(id: number): Promise<UserViewModel> {
    const user: UserViewModel[] = await this.dataSource.query(
      `SELECT * FROM "Users" WHERE id = $1`,
      [id],
    );
    if (user.length === 0) throw new NotFoundException();
    return user[0];
  }

  async registerUser(dto: CreateUserType) {
    const query = `
            INSERT INTO "Users" ("login", "passwordHash", "email")
            VALUES ($1, $2, $3) RETURNING id, login, email, "createdAt"
        `;
    const result: UserViewModel[] = await this.dataSource.query(query, [
      dto.login,
      dto.passwordHash,
      dto.email,
    ]);
    const user = result[0];
    return { ...user, id: user.id.toString() };
  }

  async findUserLoginOrEmail(
    login: string,
    email: string,
  ): Promise<UserViewModel> {
    const user: UserViewModel[] = await this.dataSource.query(
      `SELECT "login", "passwordHash", "email", "isConfirmed" FROM "Users" WHERE login = $1 OR  email = $2`,
      [login, email],
    );
    return user[0] ?? null;
  }

  async findUserByCode(code: string) {
    const user: UserViewModel[] = await this.dataSource.query(
      `SELECT * FROM "Users" WHERE "confirationCode" = $1`,
      [code],
    );

    return user[0] ?? null;
  }
}
