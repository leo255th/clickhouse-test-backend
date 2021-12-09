import { Body, Controller, Get, Post } from '@nestjs/common';
import { DataDto } from './app.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('create-table')
  async createTable(): Promise<number> {
    return this.appService.createTable();
  }
  @Post('add-data')
  async addData(
    @Body() dto: DataDto
  ): Promise<number> {
    return this.appService.addData(dto);
  }
  @Post('add-data-interval-by-sqls')
  async addDataIntervalBySqls(
  ): Promise<void> {
    return this.appService.addDataIntervalBySqls();
  }
  @Post('add-data-interval-by-stream')
  async addDataIntervalByStream():Promise<void>{
    return this.appService.addDataIntervalByStream();
  }
  @Post('get-data')
  async getData(
    @Body() dto: { n: number }
  ): Promise<DataDto[]> {
    return this.appService.getData(dto.n);
  }

  @Post('add-col')
  async addCol(
    @Body() dto: { colName: string, colType:string }
  ): Promise<number> {
    return this.appService.addCol(dto.colName,dto.colType);
  }
  @Post('add-cols')
  async addCols(
  ): Promise<number> {
    return this.appService.addCols();
  }
}
