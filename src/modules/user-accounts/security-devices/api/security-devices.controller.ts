import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RefreshTokenGuard } from '../../guards/refresh-token/resfresh-token.guard';
import { GetRefreshToken } from '../../decorators/get-refresh-token';

@UseGuards(RefreshTokenGuard)
@Controller('security')
export class SecurityDevicesController {
  constructor() {}

  @Get('devices')
  getDevices(@GetRefreshToken() token: string) {
    return token;
  }

  @Delete('devices/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDevice() {}

  @Delete('devices')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOtherDevices() {}
}
