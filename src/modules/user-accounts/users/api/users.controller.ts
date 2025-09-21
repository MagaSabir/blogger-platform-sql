import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/usecase/admins/create-user.usecase';
import { UserViewModel } from './view-dto/user-view-model';
import { DeleteUserCommand } from '../application/usecase/admins/delete-user.usecase';
import { CreateUserInputDto } from './input-dto/create-user.input-dto';
import { BasicAuthGuard } from '../../guards/basic/basic-auth.guard';
import { UsersQueryParams } from './input-dto/users-query-params';
import { GetAllUsersQuery } from '../application/queries/get-all-users.query';
import { BasePaginatedResponse } from '../../../../core/base-paginated-response';

@Controller('sa/users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserInputDto): Promise<UserViewModel> {
    return this.commandBus.execute(new CreateUserCommand(dto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteUserCommand(+id));
  }

  @Get()
  async getUsers(
    @Query() query: UsersQueryParams,
  ): Promise<BasePaginatedResponse<UserViewModel>> {
    return await this.queryBus.execute<
      GetAllUsersQuery,
      BasePaginatedResponse<UserViewModel>
    >(new GetAllUsersQuery(query));
  }
}
