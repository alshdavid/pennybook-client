import { Decimal } from "decimal.js";
import {
  AccountDetail,
  AccountId,
  CreateAccountOptions,
  IDataSource,
  TransactionDetail,
  TransactionId,
} from "../data-source/index.ts";

export class DataSourceMemory implements IDataSource {
  #state: {
    accounts: Record<AccountId, AccountDetail>;
    transactions: Record<TransactionId, TransactionDetail>;
  };

  constructor() {
    this.#state = JSON.parse(
      globalThis.localStorage.getItem("pennybook::data") ||
        JSON.stringify({
          accounts: {},
          transactions: {},
        }),
    );
    for (const key in this.#state.accounts) {
      this.#state.accounts[key].balance = new Decimal(
        this.#state.accounts[key].balance,
      );
    }
    for (const key in this.#state.transactions) {
      if (
        this.#state.transactions[key].credit !== null &&
        this.#state.transactions[key].credit !== undefined
      ) {
        this.#state.transactions[key].credit = new Decimal(
          this.#state.transactions[key].credit,
        );
      }
      if (
        this.#state.transactions[key].debit !== null &&
        this.#state.transactions[key].debit !== undefined
      ) {
        this.#state.transactions[key].debit = new Decimal(
          this.#state.transactions[key].debit,
        );
      }
    }
  }

  async *getTransactions(): AsyncIterableIterator<Array<TransactionDetail>> {
    yield Object.values(this.#state.transactions);
  }

  #sync() {
    globalThis.localStorage.setItem(
      "pennybook::data",
      JSON.stringify(this.#state),
    );
  }

  async getAccounts(): Promise<Record<string, AccountDetail>> {
    const result: Record<string, AccountDetail> = {};
    Object.entries(this.#state.accounts).forEach(([id, detail]) => {
      result[id] = { ...detail };
    });
    return result;
  }

  async createAccount(options: CreateAccountOptions): Promise<AccountId> {
    const accountId = crypto.randomUUID();
    const account: AccountDetail = {
      accountId,
      assetType: "currency",
      currencyCode: options.currencyCode,
      name: options.name,
      open: true,
      balance: new Decimal(0),
    };
    this.#state.accounts[accountId] = account;
    this.#sync();
    return accountId;
  }

  async deleteAccount(accountId: AccountId): Promise<void> {
    if (!this.#state.accounts[accountId]) {
      throw new Error(`Account ${accountId} not found`);
    }

    // Delete all transactions associated with this account
    const transactionsToDelete: TransactionId[] = [];
    Object.entries(this.#state.transactions).forEach(([id, transaction]) => {
      if (transaction.accountId === accountId) {
        transactionsToDelete.push(id);
      }
    });

    transactionsToDelete.forEach((id) => delete this.#state.transactions[id]);
    delete this.#state.accounts[accountId];
    this.#sync();
  }

  async closeAccount(accountId: AccountId): Promise<void> {
    const account = this.#state.accounts[accountId];
    if (!account) {
      throw new Error(`Account ${accountId} not found`);
    }
    account.open = false;
    this.#sync();
  }

  async addTransactions(
    ...transactions: Array<TransactionDetail>
  ): Promise<Array<TransactionId>> {
    const transactionIds: TransactionId[] = [];
    for (const transaction of transactions) {
      if (!this.#state.accounts[transaction.accountId]) {
        throw new Error(`Account ${transaction.accountId} not found`);
      }
      const transactionId = crypto.randomUUID();
      this.#state.transactions[transactionId] = {
        ...transaction,
        accountId: transaction.accountId,
      };
      transactionIds.push(transactionId);
    }
    this.#sync();
    return transactionIds;
  }

  async updateTransaction(
    transactionId: TransactionId,
    options: TransactionDetail,
  ): Promise<Array<TransactionId>> {
    const transaction = this.#state.transactions[transactionId];
    if (!transaction) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    this.#state.transactions[transactionId] = {
      ...options,
      accountId: transaction.accountId,
    };

    this.#sync();
    return [transactionId];
  }

  async deleteTransactions(
    ...transactionIds: Array<TransactionId>
  ): Promise<void> {
    for (const transactionId of transactionIds) {
      if (!this.#state.transactions[transactionId]) {
        throw new Error(`Transaction ${transactionId} not found`);
      }
      delete this.#state.transactions[transactionId];
    }
    this.#sync();
  }
}
