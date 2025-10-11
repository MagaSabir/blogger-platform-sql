import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UpdateCommentLikeStatusCommand } from '../application/usecases/update-comment-like-status.usecase';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LikeStatus } from '../../posts/application/view-dto/post-view-model';
import { JwtAuthGuard } from '../../../user-accounts/guards/bearer/jwt-auth.guard';
import { JwtOptionalAuthGuard } from '../../../user-accounts/guards/bearer/jwt-optional-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @Put(':id/like-status')
  @UseGuards(JwtAuthGuard)
  async updateCommentLike(@Param('id') id: string, @Body() status: LikeStatus) {
    return this.commandBus.execute(
      new UpdateCommentLikeStatusCommand(id, status),
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateComment(@Param('id') id: string) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(@Param('id') id: string) {}

  @Get(':id')
  @UseGuards(JwtOptionalAuthGuard)
  async getComment(@Param('id') id: string) {}
}
