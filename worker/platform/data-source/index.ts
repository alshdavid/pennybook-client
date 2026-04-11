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
  balance: string;
};

export type TransactionDetail = {
  accountId: AccountId;
  transactionId: TransactionId;
  date: string;
  notes: string;
  category: string;
  credit: string | null;
  debit: string | null;
};

export interface IDataSource {
  getAccounts(): Promise<Record<string, AccountDetail>>;
  createAccount(options: CreateAccountOptions): Promise<AccountId>;
  deleteAccount(accountId: AccountId): Promise<void>;
  closeAccount(accountId: AccountId): Promise<void>;
  getTransactions(
    accountId: AccountId,
  ): AsyncIterableIterator<Array<TransactionDetail>>;
  addTransactions(
    ...transaction: Array<TransactionDetail>
  ): Promise<Array<TransactionId>>;
  updateTransaction(
    transactionId: TransactionId,
    options: TransactionDetail,
  ): Promise<Array<TransactionId>>;
  deleteTransactions(...accountId: Array<TransactionId>): Promise<void>;
}
