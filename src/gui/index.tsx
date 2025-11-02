import "./styles.css";
import { h } from "preact";
import { PreactRouter } from "../kit/router/preact.tsx";
import { InjectContext } from "./platform/preact/inject.ts";
import { DatabaseSelectPage } from "./pages/database-select/database-select.tsx";
import { SQliteWeb } from "./platform/db/sqlite-web.ts";
import { SharedWorker } from "@alshdavid/shared-worker/shared-worker.js";
import { Accounts } from "./platform/accounts/accounts.ts";

const provider = new Map()

const worker = new SharedWorker(globalThis.importMap.resolve("worker")!, {
  type: "module",
});

const sqliteWeb = new SQliteWeb(worker)
const accounts = new Accounts(sqliteWeb)

provider.set(SharedWorker, worker)
provider.set(SQliteWeb, sqliteWeb)
provider.set(Accounts, accounts)

console.log(await accounts.getAccounts())

const app = new PreactRouter({
  baseHref: PUBLIC_PATH,
  target: document.body,
  providers: [<InjectContext.Provider value={provider}/>],
})

provider.set(PreactRouter, app)

// Routes
app.route("/", () => app.navigate("/accounts"))

app.mount("/accounts", () => <DatabaseSelectPage/>)

app.mount("/accounts/:id", ({req}) => {
  console.log('yo')
  return <div>Account {req.params.id}</div>
})

app.start()

// @ts-expect-error
globalThis.provider = Array.from(provider.values())
