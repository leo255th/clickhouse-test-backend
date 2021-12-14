import { Injectable } from "@nestjs/common";
import { AppConfig } from "app.config";
import * as ClickHouse from "@posthog/clickhouse"
import { AppService } from "./app.service";

@Injectable()
export class PosthogService {
  public ch;
  constructor(
    private appService: AppService
  ) {
    this.ch = new ClickHouse({
      host: 'localhost',
      port: AppConfig.clickhouse.port,
      format: 'JSON', // query的结果会是json格式
    })
  }

  async write100Array(): Promise<number> {
    return new Promise((res, rej) => {
      const writeStream = this.ch.query(`INSERT INTO  data_test_stream.test FORMAT TSV`, (err) => {
        if (err) {
          console.log(err)
          res(0);
        }
        console.log('Insert complete!')
        res(1);
      });
      // 循环写入100次
      for (let i = 0; i <= 100; i++) {
        writeStream.write([1]);
      }
      writeStream.end();
    })

  }
}