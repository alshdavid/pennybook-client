import { DataSourceMemory } from "./platform/data-source-mem/index.ts";
import {
  AccountId,
  TransactionDetail,
  TransactionId,
  type CreateAccountOptions,
} from "./platform/data-source/index.ts";
import { ConnectionManager } from "./platform/shared-worker/connection-manager.ts";
import {
  patchConsole,
  globalErrorHandler,
} from "./platform/shared-worker/patches.ts";

const clients = new ConnectionManager();
const dataSource = new DataSourceMemory();

patchConsole(clients);
globalErrorHandler(clients);

clients.onConnect((conn) => {
  conn.subscribe("sync", async () => {
    conn.send("accounts", await dataSource.getAccounts());
    conn.send("transactions", await dataSource.getAllTransactions());
  });

  conn.subscribe<CreateAccountOptions>(
    "accounts/create",
    async (payload, res) => {
      const id = await dataSource.createAccount(payload);
      res.res(id);
      clients.sendAll("accounts", await dataSource.getAccounts());
    },
  );

  conn.subscribe<AccountId, void>("accounts/delete", async (payload, res) => {
    await dataSource.deleteAccount(payload);
    res.res(undefined);
    clients.sendAll("accounts", await dataSource.getAccounts());
  });

  conn.subscribe<AccountId, void>("accounts/close", async (payload, res) => {
    await dataSource.closeAccount(payload);
    res.res(undefined);
    clients.sendAll("accounts", await dataSource.getAccounts());
  });

  conn.subscribe<Array<TransactionDetail>>(
    "transactions/add",
    async (payload, res) => {
      const result = await dataSource.addTransactions(...payload);
      res.res(result);
      clients.sendAll("transactions", await dataSource.getAllTransactions());
      clients.sendAll("accounts", await dataSource.getAccounts());
    },
  );

  conn.subscribe<[TransactionId, TransactionDetail], void>(
    "transactions/update",
    async (payload, res) => {
      await dataSource.updateTransaction(...payload);
      res.res(undefined);
      clients.sendAll("transactions", await dataSource.getAllTransactions());
      clients.sendAll("accounts", await dataSource.getAccounts());
    },
  );

  conn.onDisconnect(() => {
    console.warn("disconnected", conn.id());
  });
});
