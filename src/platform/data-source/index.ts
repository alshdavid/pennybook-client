import { type Decimal } from "decimal.js";

export const IDataSourceToken = Symbol("IDataSource");

export type AccountId = string;
export type TransactionId = string;

export type CreateAccountOptions = {
  currencyCode: string;
  name: string;
};

export type AccountDetail = {
  accountId: string;
  assetType: string;
  currencyCode: string;
  name: string;
  open: boolean;
  balance: Decimal;
};

export type TransactionDetail = {
  accountId: AccountId;
  date: string;
  notes: string;
  category: string;
  credit: Decimal | null;
  debit: Decimal | null;
};

export type SerdeDecimal = [number, number];

export interface IDataSource {
  getAccounts(): Promise<Record<string, AccountDetail>>;
  createAccount(options: CreateAccountOptions): Promise<AccountId>;
  deleteAccount(accountId: AccountId): Promise<void>;
  closeAccount(accountId: AccountId): Promise<void>;
  getTransactions(): AsyncIterableIterator<Array<TransactionDetail>>;
  addTransactions(
    ...transaction: Array<TransactionDetail>
  ): Promise<Array<TransactionId>>;
  updateTransaction(
    transactionId: TransactionId,
    options: TransactionDetail,
  ): Promise<Array<TransactionId>>;
  deleteTransactions(...accountId: Array<TransactionId>): Promise<void>;
}
