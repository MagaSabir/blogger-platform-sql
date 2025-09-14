import { UsersRepository } from '../../infrastructure/users.repository';
import { PasswordService } from './password.service';
import { UserDbModel } from '../../api/view-dto/user-db-model';

export class AuthService {
  constructor(
    private userRepository: UsersRepository,
    private passwordService: PasswordService,
  ) {}

  async validateUser(login: string, password: string) {
    const user: UserDbModel = await this.userRepository.findUserByLogin(login);

    if (!user) {
      return null;
    }

    const hash = user.passwordHash;
    const isPasswordValid = await this.passwordService.compare(password, hash);

    if (!isPasswordValid) {
      return null;
    }

    return { id: user.id };
  }
}
