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
    this.#state = {
      accounts: {},
      transactions: {},
    };
  }

  async *getTransactions(
    accountId: AccountId,
  ): AsyncIterableIterator<Array<TransactionDetail>> {
    yield Object.values(this.#state.transactions).filter(
      (t) => t.accountId === accountId,
    );
  }

  async getAllTransactions(): Promise<Record<TransactionId, TransactionDetail>> {
    return structuredClone(this.#state.transactions)
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
      balance: "0",
    };
    this.#state.accounts[accountId] = account;
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
  }

  async closeAccount(accountId: AccountId): Promise<void> {
    const account = this.#state.accounts[accountId];
    if (!account) {
      throw new Error(`Account ${accountId} not found`);
    }
    account.open = false;
  }

  async addTransactions(
    ...transactions: Array<Omit<TransactionDetail, "transactionId">>
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
        transactionId,
      };
      transactionIds.push(transactionId);

      // Inefficient
      this.#state.accounts[transaction.accountId].balance = calculateBalance(
        Object.values(this.#state.transactions),
        transaction.accountId,
      );
    }
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
  }
}

function calculateBalance(
  transactions: Array<TransactionDetail>,
  accountId: AccountId,
): string {
  return transactions
    .filter((t) => t.accountId === accountId)
    .reduce((balance, transaction) => {
      if (transaction.credit !== null) {
        return balance.plus(new Decimal(transaction.credit));
      }
      if (transaction.debit !== null) {
        return balance.minus(new Decimal(transaction.debit));
      }
      return balance;
    }, new Decimal(0)).toString();
}
