const { ClickHouse } = require('clickhouse');
import { Injectable, Scope } from '@nestjs/common';
import { AppConfig } from 'app.config';
// import { ClickHouse } from 'clickhouse';

@Injectable({ scope: Scope.REQUEST })
export class ClickhouseService {

  private _clickhouse;

  constructor() {
    this._clickhouse = new ClickHouse({
      ...AppConfig.clickhouse,
    });
  }
  
  public async query(sqlString: string): Promise<any> {
    return this._clickhouse.query(sqlString).toPromise();
  }
}