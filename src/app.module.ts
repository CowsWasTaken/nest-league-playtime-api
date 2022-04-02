import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MatchesModule } from './matches/matches.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot(), MatchesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
