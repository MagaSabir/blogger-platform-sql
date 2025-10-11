import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatusInputDto } from '../../api/input-dto/like-input.dto';

export class PostSetLikeCommand {
  constructor(
    public id: string,
    public dto: LikeStatusInputDto,
  ) {}
}

@CommandHandler(PostSetLikeCommand)
export class PostSetLikeUseCase implements ICommandHandler<PostSetLikeCommand> {
  constructor() {}
  async execute() {}
}
