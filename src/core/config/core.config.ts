import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { ConfigValidation } from './config-validation';

export enum Environments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TESTING = 'testing',
}
@Injectable()
export class CoreConfig {
  @IsNumber(
    {},
    {
      message: 'Set Env variable Port',
    },
  )
  port: number;

  db_port: number;
  type: string;
  host: string;
  username: string;
  password: string;
  database: string;

  @IsEnum(Environments)
  env: string;

  constructor(private configService: ConfigService) {
    this.db_port = Number(this.configService.get('DB_PORT'));
    this.port = Number(this.configService.get('PORT'));
    this.type = this.configService.get('DB_TYPE') || '';
    this.username = this.configService.get('DB_USERNAME') || '';
    this.password = this.configService.get('DB_PASSWORD') || '';
    this.database = this.configService.get('DB_NAME') || '';
    this.host = this.configService.get('DB_HOST') || '';
    this.env = this.configService.get('NODE_ENV') || '';
    console.log(this.env);
    ConfigValidation.validationConfig(this);
  }
}
