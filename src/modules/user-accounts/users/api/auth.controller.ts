import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { CreateUserInputDto } from './input-dto/create-user.input-dto';
import { RegistrationUserCommand } from '../application/usecase/registration-user.usecase';
import { LocalAuthGuard } from '../../guards/local/local.auth.guard';
import { CurrentUserId } from '../../../../core/decorators/current-user-id';
import { Request, Response } from 'express';
import { LoginUserCommand } from '../application/usecase/login-user.usecase';
import { JwtAuthGuard } from '../../guards/bearer/jwt-auth.guard';
import { GetUserQuery } from '../application/queries/get-user.query';
import { UserViewModel } from './view-dto/user-view-model';
import { InputCodeValidation } from './input-dto/input-code-validation';
import { RegistrationConfirmationCommand } from '../application/usecase/registration-confirmation.usecase';
import { InputEmailValidation } from './input-dto/input-email-validation';
import { ResendConfirmationEmailCommand } from '../application/usecase/resend-confirmation-email.usecase';
import { PasswordRecoveryCommand } from '../application/usecase/password-recovery.usecase';
import { NewPasswordCommand } from '../application/usecase/new-password.usecase';
import { InputNewPasswordDto } from './input-dto/input-password-validation';
import { RefreshTokenGuard } from '../../guards/refresh-token/resfresh-token.guard';
import { RefreshTokenCommand } from '../application/usecase/refresh-token.usecase';
import { GetRefreshToken } from '../../decorators/get-refresh-token';
import { LogoutCommand } from '../application/usecase/logout.usecase';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post('registration')
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() dto: CreateUserInputDto) {
    await this.commandBus.execute(new RegistrationUserCommand(dto));
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @CurrentUserId() userId: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const ip = req.ip || 'undefined';
    const userAgent: string = req.headers['user-agent'] || 'undefined';
    const {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken: string } =
      await this.commandBus.execute(
        new LoginUserCommand(userId, ip, userAgent),
      );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 24 * 7,
    });
    res.json({ accessToken: accessToken });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUserId() userId: string): Promise<UserViewModel> {
    return this.queryBus.execute(new GetUserQuery(userId));
  }

  @Post('registration-confirmation')
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmation(@Body() body: InputCodeValidation): Promise<void> {
    await this.commandBus.execute(
      new RegistrationConfirmationCommand(body.code),
    );
  }

  @Post('registration-email-resending')
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() body: InputEmailValidation,
  ): Promise<void> {
    await this.commandBus.execute(
      new ResendConfirmationEmailCommand(body.email),
    );
  }

  @Post('password-recovery')
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() body: InputEmailValidation) {
    await this.commandBus.execute(new PasswordRecoveryCommand(body.email));
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() body: InputNewPasswordDto) {
    await this.commandBus.execute(
      new NewPasswordCommand(body.newPassword, body.recoveryCode),
    );
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@GetRefreshToken() token: string, @Res() res: Response) {
    const result: {
      accessToken: string;
      refreshToken: string;
    } = await this.commandBus.execute(new RefreshTokenCommand(token));

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return res.json({ accessToken: result.accessToken });
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenGuard)
  async logout(@GetRefreshToken() token: string, @Res() res: Response) {
    await this.commandBus.execute(new LogoutCommand(token));
    res.clearCookie('refreshToken');
    return res.sendStatus(204);
  }
}
