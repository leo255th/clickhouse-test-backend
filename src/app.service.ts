import { Injectable } from '@nestjs/common';
import { ClickhouseService } from './clickhouse.service';
import { TableCreateSQL } from './models/table.sql.js'

@Injectable()
export class AppService {

  constructor(
    private readonly clickhouseService: ClickhouseService,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  // 创建表格
  async createTable(): Promise<any> {
    const r = await this.clickhouseService.query(TableCreateSQL);
    return r;
  }
}
