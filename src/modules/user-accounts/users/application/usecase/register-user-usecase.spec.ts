import {
  RegistrationUserCommand,
  RegistrationUserUseCase,
} from './registration-user.usecase';
import { UsersRepository } from '../../infrastructure/users.repository';
import { PasswordService } from '../services/password.service';
import { EmailService } from '../../../../notification/email.service';

describe('register user', () => {
  let useCase: RegistrationUserUseCase;
  let usersRepository: jest.Mocked<UsersRepository>;
  let passwordService: jest.Mocked<PasswordService>;
  let mailService: jest.Mocked<EmailService>;

  beforeEach(() => {
    passwordService = { hash: jest.fn().mockResolvedValue('hashed') } as any;

    usersRepository = {
      findUserByLoginOrEmail: jest.fn(),
      registerUser: jest.fn(),
    } as any;

    mailService = { sendConfirmationEmail: jest.fn() } as any;

    useCase = new RegistrationUserUseCase(
      passwordService,
      usersRepository,
      mailService,
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should register new user', async () => {
    const dto = {
      login: 'test',
      password: 'password',
      email: 'example@mail.com',
    };

    (usersRepository.findUserByLoginOrEmail as jest.Mock).mockResolvedValue(
      null,
    );
    const command = new RegistrationUserCommand(dto);
    await useCase.execute(command);

    expect(usersRepository.findUserByLoginOrEmail).toHaveBeenCalledWith(
      dto.login,
      dto.email,
    );

    expect(passwordService.hash).toHaveBeenCalledWith(dto.password);

    expect(usersRepository.registerUser).toHaveBeenCalledWith(
      expect.objectContaining({
        login: dto.login,
        email: dto.email,
        passwordHash: 'hashed',
        confirmationCode: expect.any(String),
      }),
    );
    expect(mailService.sendConfirmationEmail).toHaveBeenCalledWith(
      dto.email,
      expect.any(String),
    );
  });
});
