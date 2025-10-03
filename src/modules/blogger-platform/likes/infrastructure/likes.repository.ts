import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LikeStatus } from '../../posts/application/view-dto/post-view-model';

export class LikesRepository {
  constructor(@InjectDataSource() dataSource: DataSource) {}

  async updateCommentLikeStatus(commentId: string, likeStatus: LikeStatus) {}
}
