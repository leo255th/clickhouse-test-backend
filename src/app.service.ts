import { Injectable } from '@nestjs/common';
import { DataDto } from './app.dto';
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
  async createTable(): Promise<number> {
    const r = await this.clickhouseService.query(TableCreateSQL);
    return r;
  }

  // 插入数据，返回被影响的行数
  async addData(dto:DataDto):Promise<number>{
    console.log(dto);
    const sql=`INSERT INTO test VALUES (${dto.id},'${dto.name}',${dto.age},${dto.time})`;
    const r=await this.clickhouseService.query(sql);
    return r;
  }

  // 查询前n条数据
  async getData(n:number):Promise<DataDto[]>{
    const sql=`
    select *
    from test
    limit 0,${n}
    `;
  const r=await this.clickhouseService.query(sql);
  console.log(r);
  return r as DataDto[];
  }

  // 增加字段

  async addCol(colName:string,colType:string):Promise<number>{
    const sql=`
    ALTER TABLE test ADD COLUMN IF NOT EXISTS ${colName} ${colType};
    `;
    const r=await this.clickhouseService.query(sql);
    return r;
  }

}
