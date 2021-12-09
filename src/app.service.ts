import { Injectable } from '@nestjs/common';
import { setInterval } from 'timers';
import { DataDto } from './app.dto';
import { ClickhouseService } from './clickhouse.service';
import { TableCreateSQL } from './models/table.sql.js'
import { SqlService } from './utils/sql.class';

@Injectable()
export class AppService {

  constructor(
    private readonly clickhouseService: ClickhouseService,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  // 创建表格
  async createTable(): Promise<number> {
    const r = await this.clickhouseService.query(TableCreateSQL);
    return r;
  }

  // 插入数据，返回被影响的行数
  async addData(dto: DataDto): Promise<number> {
    console.log(dto);
    let sql = `INSERT INTO  test(id) VALUES (${dto.id});`;
    sql += sql;
    const r = await this.clickhouseService.query(sql);
    return r;
  }

  // 查询前n条数据
  async getData(n: number): Promise<DataDto[]> {
    const sql = `
    select *
    from  test
    limit 0,${n}
    `;
    const r = await this.clickhouseService.query(sql);
    console.log(r);
    return r as DataDto[];
  }

  // 增加字段

  async addCol(colName: string, colType: string): Promise<number> {
    const sql = `
    ALTER TABLE  test ADD COLUMN IF NOT EXISTS ${colName} ${colType};
    `;
    const r = await this.clickhouseService.query(sql);
    return r;
  }

  // 用于测试，增加大量字段
  async addCols(): Promise<number> {
    const sqlService = new SqlService();
    sqlService.start();
    for (let i = 1; i <= 300; i++) {
      sqlService.addOneStatement(`ALTER TABLE  test ADD COLUMN IF NOT EXISTS ${'kgl' + i} Boolean;`);
    }
    for (let i = 1; i <= 300; i++) {
      sqlService.addOneStatement(`ALTER TABLE  test ADD COLUMN IF NOT EXISTS ${'mnl' + i} Float32;`);
    }
    for (let i = 1; i <= 300; i++) {
      sqlService.addOneStatement(`ALTER TABLE  test ADD COLUMN IF NOT EXISTS ${'yl' + i} Float32;`);
    }
    for (let i = 1; i <= 300; i++) {
      sqlService.addOneStatement(`ALTER TABLE  test ADD COLUMN IF NOT EXISTS ${'zd' + i} Float32;`);
    }
    const sqlList = sqlService.end();
    for (const sql of sqlList) {
      await this.clickhouseService.query(sql);
    }
    return 1;
  }

  // 用于测试，按一定频率插入一条数据
  async addDataIntervalBySqls() {
    const dataSize = 1;
    setInterval(async () => {
      const sqls = [];
      const rStart = new Date().getTime();
      for (let i = 0; i < dataSize; i++) {
        sqls.push(this.randomValueSQL());
      }
      const rEnd = new Date().getTime();
      console.log('生成随机数据完成，耗时' + (rEnd - rStart) + '毫秒');
      const start = new Date().getTime();
      for (const sql of sqls) {
        await this.clickhouseService.query(sql);
      }
      const end = new Date().getTime();
      console.log('插入完成，耗时' + (end - start) + '毫秒');
    }, 1000)
  }

  // 用于测试，插入流数据
  async addDataByStream() {
    const dataSize = 60*5;
    // 生成insertSQL,在这里只描述要插入的表和字段，以获得流对象
    let insertSQL = 'INSERT INTO  test ';
    // 添加字段
    // insertSQL += '(id,';
    // for (let i = 1; i <= 300; i++) {
    //   insertSQL += ('kgl' + i)
    //   insertSQL += ','
    // }
    // for (let i = 1; i <= 300; i++) {
    //   insertSQL += ('mnl' + i)
    //   insertSQL += ','
    // }
    // for (let i = 1; i <= 300; i++) {
    //   insertSQL += ('yl' + i)
    //   insertSQL += ','
    // }
    // for (let i = 1; i <= 300; i++) {
    //   insertSQL += ('zd' + i)
    //   if (i != 300) {
    //     insertSQL += ','
    //   }
    // }
    // insertSQL += ') Values';
    
    const ws = await this.clickhouseService.getWriteStream(insertSQL);
    const start = new Date().getTime();
    for (let i = 0; i < dataSize; i++) {
      // 每行的样子应该是'(xxx,xxx,xxx,xxx,...,xxx)'
      ws.writeRow(
        this.randomValueArray().join('\t')
      )
      // await ws.writeRow(
      //   this.randomValueArray()
      // );
    }
    const send = new Date().getTime();
    console.log('生成随机数据完成，耗时' + (send - start) + '毫秒');
    await ws.exec();
    const end = new Date().getTime();
    console.log('插入完成，耗时' + (end - start) + '毫秒');
    return {
      res: true
    }
  }
  randomValueArray(): Array<number> {
    // 最开始的数据是ID字段，都写1
    const a = [1];
    for (let i = 1; i <= 300; i++) {
      a.push(Math.round(Math.random()));

    }
    for (let i = 1; i <= 300; i++) {
      a.push(Math.random() * 100);
    }
    for (let i = 1; i <= 300; i++) {
      a.push(Math.random() * 100);
    }
    for (let i = 1; i <= 300; i++) {
      a.push(Math.random() * 100);
    }
    return a;
  }
  randomValueSQL(): string {
    // const start = new Date().getTime();
    // 生成插入语句
    let insertSQL = 'INSERT INTO  test';
    // 添加字段
    insertSQL += '(id,';
    for (let i = 1; i <= 300; i++) {
      insertSQL += ('kgl' + i)
      insertSQL += ','
    }
    for (let i = 1; i <= 300; i++) {
      insertSQL += ('mnl' + i)
      insertSQL += ','
    }
    for (let i = 1; i <= 300; i++) {
      insertSQL += ('yl' + i)
      insertSQL += ','
    }
    for (let i = 1; i <= 300; i++) {
      insertSQL += ('zd' + i)
      if (i != 300) {
        insertSQL += ','
      }
    }
    insertSQL += ') '
    // 添加数据
    insertSQL += 'VALUES(1,'
    for (let i = 1; i <= 300; i++) {
      insertSQL += Math.round(Math.random());
      insertSQL += ','

    }
    for (let i = 1; i <= 300; i++) {
      insertSQL += Math.random() * 100;
      insertSQL += ','
    }
    for (let i = 1; i <= 300; i++) {
      insertSQL += Math.random() * 100;
      insertSQL += ','
    }
    for (let i = 1; i <= 300; i++) {
      insertSQL += Math.random() * 100;
      if (i != 300) {
        insertSQL += ','
      }
    }
    insertSQL += ')'
    // const end = new Date().getTime();
    // console.log('生成随机数据完成，耗时' + (end - start) + '毫秒');
    return insertSQL;
  }

}
