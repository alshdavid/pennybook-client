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

const app = new PreactRouter({
  root: document.body,
  baseHref: AUTO_BASE_HREF,
  providers: []
})

app.mount(['/', '/index.html'], () => <HomePage />)
app.mount('/dashboard', () => <DashboardPage />)
app.mount('/budget', () => <BudgetPage />)
app.mount('/query', () => <QueryPage />)
app.mount('/accounts', () => <AccountsPage />)
app.mount('/accounts/:id', () => <AccountsDetailPage />)

app.mount('/**', () => <NotFoundPage />)

app.start()