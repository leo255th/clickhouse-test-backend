
// 用于合并多条SQL语句，让clickhouse在一次执行中并行操作，提高性能
export class SqlService{
  private _sql:string[]; // 要拼接的sql字符串；
  constructor(){}

  // 初始化sql字符串
  public start(){
    this._sql=[];
  }
  // 在末尾添加一条sql语句。
  public addOneStatement(sql:string){
    if(!sql||sql.length==0){
      return false;
    }
    // 在末尾添加sql
    this._sql.push(sql.trim());
  }
  public end():string[]{
    return this._sql;
  }
}