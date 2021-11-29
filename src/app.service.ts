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
    let sql = `INSERT INTO  test3(id) VALUES (${dto.id});`;
    sql += sql;
    const r = await this.clickhouseService.query(sql);
    return r;
  }

  // 查询前n条数据
  async getData(n: number): Promise<DataDto[]> {
    const sql = `
    select *
    from  test3
    limit 0,${n}
    `;
    const r = await this.clickhouseService.query(sql);
    console.log(r);
    return r as DataDto[];
  }

  // 增加字段

  async addCol(colName: string, colType: string): Promise<number> {
    const sql = `
    ALTER TABLE  test3 ADD COLUMN IF NOT EXISTS ${colName} ${colType};
    `;
    const r = await this.clickhouseService.query(sql);
    return r;
  }

  // 用于测试，增加大量字段
  async addCols(): Promise<number> {
    const sqlService = new SqlService();
    sqlService.start();
    for (let i = 1; i <= 300; i++) {
      sqlService.addOneStatement(`ALTER TABLE  test3 ADD COLUMN IF NOT EXISTS ${'kgl' + i} Boolean;`);
    }
    for (let i = 1; i <= 300; i++) {
      sqlService.addOneStatement(`ALTER TABLE  test3 ADD COLUMN IF NOT EXISTS ${'mnl' + i} Float32;`);
    }
    for (let i = 1; i <= 300; i++) {
      sqlService.addOneStatement(`ALTER TABLE  test3 ADD COLUMN IF NOT EXISTS ${'yl' + i} Float32;`);
    }
    for (let i = 1; i <= 300; i++) {
      sqlService.addOneStatement(`ALTER TABLE  test3 ADD COLUMN IF NOT EXISTS ${'zd' + i} Float32;`);
    }
    const sqlList = sqlService.end();
    for (const sql of sqlList) {
      await this.clickhouseService.query(sql);
    }
    return 1;
  }

  // 用于测试，每秒插入一条数据
  async addDataInterval() {
    setInterval(async () => {
      const insertSQL=this.randomValueSQL();
      const start = new Date().getTime();
      const r = await this.clickhouseService.query(insertSQL);
      const end = new Date().getTime();
      console.log('插入完成，耗时' + (end - start) + '毫秒');
    }, 100)
  }

  randomValueSQL(): string {
    const start = new Date().getTime();
    // 生成插入语句
    let insertSQL = 'INSERT INTO  test3';
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
      insertSQL += Math.random()*100;
      insertSQL += ','
    }
    for (let i = 1; i <= 300; i++) {
      insertSQL += Math.random()*100;
      insertSQL += ','
    }
    for (let i = 1; i <= 300; i++) {
      insertSQL += Math.random()*100;
      if (i != 300) {
        insertSQL += ','
      }
    }
    insertSQL += ')'
    const end = new Date().getTime();
    console.log('生成随机数据完成，耗时' + (end - start) + '毫秒');
    return insertSQL;
  }

}
