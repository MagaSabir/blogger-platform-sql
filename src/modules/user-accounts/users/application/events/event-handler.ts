import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from '../../../../notification/email.service';
import { UserRegisteredEvent } from './user-registered.event';

@EventsHandler(UserRegisteredEvent)
export class SendConfirmationEmailHandler
  implements IEventHandler<UserRegisteredEvent>
{
  constructor(private mailService: EmailService) {}

  handle(event: UserRegisteredEvent) {
    this.mailService.sendConfirmationEmail(event.email, event.code);
  }
}
