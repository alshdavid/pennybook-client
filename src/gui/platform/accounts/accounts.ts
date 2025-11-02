import { SQliteWeb } from "../db/sqlite-web.ts";

export type AccountModel = {
  id: string,
  name: string,
}

export class Accounts {
  #sqliteWeb: SQliteWeb;
  #ready: Promise<unknown>

  constructor(sqliteWeb: SQliteWeb) {
    this.#sqliteWeb = sqliteWeb;

    this.#ready = sqliteWeb.exec(`
      CREATE TABLE IF NOT EXISTS accounts ("id" TEXT UNIQUE, "name" TEXT UNIQUE)`)
  }

  async getAccounts() {
    await this.#ready
    return this.#sqliteWeb.exec<AccountModel>(`
      SELECT * FROM accounts;`)
  }

  async addAccount(accountName: string) {
    await this.#ready
    const id = crypto.randomUUID()
    console.log({ id, accountName })
    await this.#sqliteWeb.exec<AccountModel>(`
      INSERT INTO accounts (id, name) VALUES ('${id}', '${accountName}')`)
  }
}
