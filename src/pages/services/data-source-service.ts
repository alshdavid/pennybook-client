import {
  AccountDetail,
  AccountId,
  CreateAccountOptions,
  TransactionDetail,
  IDataSource,
  TransactionId,
} from "../../platform/data-source/index.ts";
import { notifyChange } from "../../platform/rx/notify-change.ts";

export type DataSourceServiceOptions = {
  sources: Record<string, IDataSource>
}

export class DataSourceService extends EventTarget implements IDataSource {
  #source: IDataSource | undefined
  #sources: Map<string, IDataSource>

  constructor(options: DataSourceServiceOptions) {
    super()
    this.#sources = new Map(Object.entries(options.sources))
  }

  getTransactions(): Promise<Array<TransactionDetail>> {
    if (!this.#source) throw new Error("Method not implemented.");
    return this.#source.getTransactions()
  }

  list(): Record<string, IDataSource> {
    const result: Record<string, IDataSource> = {}
    for (const [k, v] of this.#sources.entries()) {
      result[k] = v
    }
    return result
  }
  
  select(source: string) {
    const selected = this.#sources.get(source)
    if (!selected) throw new Error("Source does not exist");
    this.#source = selected
    notifyChange(this)
  }

  getAccounts(): Promise<Record<string, AccountDetail>> {
    if (!this.#source) throw new Error("Method not implemented.");
    return this.#source.getAccounts()
  }

  async createAccount(
    options: CreateAccountOptions,
  ): Promise<AccountId> {
    if (!this.#source) throw new Error("Method not implemented.");
    const result = await this.#source.createAccount(options)
    notifyChange(this)
    return result
  }

  async deleteAccount(accountId: AccountId): Promise<void> {
    if (!this.#source) throw new Error("Method not implemented.");
    return this.#source.deleteAccount(accountId)
  }
  async closeAccount(accountId: AccountId): Promise<void> {
    if (!this.#source) throw new Error("Method not implemented.");
    const result = await this.#source.closeAccount(accountId)
    notifyChange(this)
    return result
  }

  async addTransactions(
    ...transaction: Array<TransactionDetail>
  ): Promise<Array<TransactionId>> {
    if (!this.#source) throw new Error("Method not implemented.");
    const result = await this.#source.addTransactions(...transaction)
    notifyChange(this)
    return result
  }

  async updateTransaction(
    transactionId: TransactionId,
    options: TransactionDetail,
  ): Promise<Array<TransactionId>> {
    if (!this.#source) throw new Error("Method not implemented.");
    const result = await this.#source.updateTransaction(transactionId, options)
    notifyChange(this)
    return result
  }

  async deleteTransactions(...accountId: Array<TransactionId>): Promise<void> {
    if (!this.#source) throw new Error("Method not implemented.");
    const result = await this.#source.deleteTransactions(...accountId)
    notifyChange(this)
    return result
  }

}
