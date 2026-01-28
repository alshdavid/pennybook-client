import {
  AccountDetail,
  AccountId,
  CreateAccountOptions,
  TransactionDetail,
  IDataSource,
  TransactionId,
} from "../../platform/data-source/index.ts";
import { BehaviorSubject } from "../../platform/rxjs/index.ts";

export type DataSourceServiceOptions = {
  sources: Record<string, IDataSource>;
};

export class DataSourceService
  extends BehaviorSubject<void>
  implements IDataSource
{
  #source: IDataSource | undefined;
  #sources: Map<string, IDataSource>;

  constructor(options: DataSourceServiceOptions) {
    super();
    this.#sources = new Map(Object.entries(options.sources));
  }

  getTransactions(): AsyncIterableIterator<Array<TransactionDetail>> {
    if (!this.#source) throw new Error("Method not implemented.");
    return this.#source.getTransactions();
  }

  list(): Record<string, IDataSource> {
    const result: Record<string, IDataSource> = {};
    for (const [k, v] of this.#sources.entries()) {
      result[k] = v;
    }
    return result;
  }

  select(source: string) {
    const selected = this.#sources.get(source);
    if (!selected) throw new Error("Source does not exist");
    this.#source = selected;
    this.next();
  }

  getAccounts(): Promise<Record<string, AccountDetail>> {
    if (!this.#source) throw new Error("Method not implemented.");
    return this.#source.getAccounts();
  }

  async createAccount(options: CreateAccountOptions): Promise<AccountId> {
    if (!this.#source) throw new Error("Method not implemented.");
    const result = await this.#source.createAccount(options);
    this.next();
    return result;
  }

  async deleteAccount(accountId: AccountId): Promise<void> {
    if (!this.#source) throw new Error("Method not implemented.");
    await this.#source.deleteAccount(accountId);
    this.next();
  }

  async closeAccount(accountId: AccountId): Promise<void> {
    if (!this.#source) throw new Error("Method not implemented.");
    const result = await this.#source.closeAccount(accountId);
    this.next();
    return result;
  }

  async addTransactions(
    ...transaction: Array<TransactionDetail>
  ): Promise<Array<TransactionId>> {
    if (!this.#source) throw new Error("Method not implemented.");
    const result = await this.#source.addTransactions(...transaction);
    this.next();
    return result;
  }

  async updateTransaction(
    transactionId: TransactionId,
    options: TransactionDetail,
  ): Promise<Array<TransactionId>> {
    if (!this.#source) throw new Error("Method not implemented.");
    const result = await this.#source.updateTransaction(transactionId, options);
    this.next();
    return result;
  }

  async deleteTransactions(...accountId: Array<TransactionId>): Promise<void> {
    if (!this.#source) throw new Error("Method not implemented.");
    const result = await this.#source.deleteTransactions(...accountId);
    this.next();
    return result;
  }
}
