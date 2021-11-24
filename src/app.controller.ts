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
    @Body()dto:DataDto
  ):Promise<number>{
    return this.appService.addData(dto);
  }
  @Post('get-data')
  async getData(
    @Body() dto:any
  ):Promise<DataDto[]>{
    return this.appService.getData(dto.n);
  }
}
