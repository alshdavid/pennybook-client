export interface IDatabase {
  exec<Result extends Record<string, string | number | boolean>>(sql: string): Promise<Array<Result>>
}
