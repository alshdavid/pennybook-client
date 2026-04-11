import { BehaviorSubject, Observable } from "rxjs";
import type {
  AccountDetail,
  AccountId,
  CreateAccountOptions,
  TransactionDetail,
  TransactionId,
} from "../../../worker/platform/data-source/index.ts";

export class DataSource {
  accounts: BehaviorSubject<Record<string, AccountDetail>>;
  transactions: BehaviorSubject<Record<TransactionId, TransactionDetail>>;

  constructor() {
    this.accounts = new BehaviorSubject({});
    this.transactions = new BehaviorSubject({});

    pbWorker.subscribe<Record<string, AccountDetail>>("accounts", (accounts) =>
      this.accounts.next(accounts),
    );
    pbWorker.subscribe<Record<string, TransactionDetail>>(
      "transactions",
      (transactions) => this.transactions.next(transactions),
    );

    pbWorker.send("sync");
  }

  createAccount(options: CreateAccountOptions): Promise<string> {
    return pbWorker.send("accounts/create", options);
  }

  deleteAccount(accountId: AccountId): Promise<void> {
    return pbWorker.send("accounts/delete", accountId);
  }

  closeAccount(accountId: AccountId): Promise<void> {
    return pbWorker.send("accounts/close", accountId);
  }

  async addTransactions(
    ...transaction: Array<Omit<TransactionDetail, "transactionId">>
  ): Promise<void> {
    await pbWorker.send("transactions/add", transaction);
  }

  async updateTransaction(
    transactionId: TransactionId,
    options: TransactionDetail,
  ): Promise<void> {
    await pbWorker.send("transactions/update", [transactionId, options]);
  }

  async deleteTransactions(...accountId: Array<TransactionId>): Promise<void> {
    await pbWorker.send("transactions/delete", accountId);
  }
}
