import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClickhouseService } from './clickhouse.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService,ClickhouseService],
})
export class AppModule {}
