import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClickhouseService } from './clickhouse.service';
import { PosthogService } from './posthog.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService,ClickhouseService,PosthogService],
})
export class AppModule {}
