import "./styles.scss";
import { h } from "preact";
import { PreactRouter } from "./platform/router/preact.tsx";
import { AUTO_BASE_HREF } from "./platform/router/router.ts";
import { HomePage } from "./pages/home/home-page.tsx";
import { NotFoundPage } from "./pages/not-found/home-page.tsx";
import { DashboardPage } from "./pages/dashboard/dashboard.tsx";
import { BudgetPage } from "./pages/budget/budget.tsx";
import { QueryPage } from "./pages/query/query.tsx";
import { AccountsPage } from "./pages/accounts/accounts.tsx";
import { AccountsDetailPage } from "./pages/accounts-detail/accounts-detail.tsx";
import { DataSourceMemory } from "./platform/data-source-mem/index.ts";
import { Provider } from "./platform/preact/provider.ts";
import { DataSourceService } from "./pages/services/data-source-service.ts";
import {Decimal} from "decimal.js";

const provider = new Provider()

const dataSourceMemory = new DataSourceMemory()
const dataSourceService = new DataSourceService({
  sources: {
    'memory': dataSourceMemory
  }
})
dataSourceService.select('memory')
provider.set(DataSourceService, dataSourceService)

const app = new PreactRouter({
  root: document.body,
  baseHref: AUTO_BASE_HREF,
  providers: [<Provider.Provider value={provider} />]
})

app.mount(['/', '/index.html'], () => <HomePage />)
app.mount('/dashboard', () => <DashboardPage />)
app.mount('/budget', () => <BudgetPage />)
app.mount('/query', () => <QueryPage />)
app.mount('/accounts', () => <AccountsPage />)
app.mount('/accounts/:id', () => <AccountsDetailPage />)

app.mount('/**', () => <NotFoundPage />)

app.start()

// @ts-expect-error
globalThis.ds = dataSourceService
// @ts-expect-error
globalThis.Decimal = Decimal