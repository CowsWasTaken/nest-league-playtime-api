import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MatchDto } from './matches/dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  testing(@Body() dto: MatchDto): MatchDto {
    return dto;
  }
}
