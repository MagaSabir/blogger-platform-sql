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
import {
  BasePaginatedResponse,
  PaginatedUsersResponse,
} from '../../../../core/base-paginated-response';
import {
  ApiBasicAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('sa/users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  @ApiBody({ type: CreateUserInputDto })
  @ApiResponse({
    status: 201,
    description: 'Data for constructing new user',
    type: UserViewModel,
  })
  @ApiResponse({
    status: 400,
    description: 'If the input has incorrect values',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBasicAuth('basic')
  @ApiOperation({
    summary: 'Add new user to system',
  })
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserInputDto): Promise<UserViewModel> {
    return this.commandBus.execute(new CreateUserCommand(dto));
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user specified by id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID',
    example: 'id',
  })
  @ApiBasicAuth('basic')
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteUserCommand(+id));
  }

  @ApiResponse({
    status: 200,
    description: 'List of users with pagination',
    type: PaginatedUsersResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBasicAuth('basic')
  @ApiOperation({
    summary: 'Return all users',
  })
  @Get()
  async getUsers(
    @Query() query: UsersQueryParams,
  ): Promise<BasePaginatedResponse<UserViewModel>> {
    return this.queryBus.execute(new GetAllUsersQuery(query));
  }
}
