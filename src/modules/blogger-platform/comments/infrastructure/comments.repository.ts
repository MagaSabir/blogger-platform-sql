import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LikeStatus } from '../../posts/application/view-dto/post-view-model';

export class CommentsRepository {
  constructor(@InjectDataSource() dataSource: DataSource) {}

  async updateComment(commentId: string, content: string) {}

  async deleteComment(commentId: string) {}
}
