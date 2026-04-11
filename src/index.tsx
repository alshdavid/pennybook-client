import "./styles.scss";
import { Fragment, h } from "preact";
import { PreactRouter } from "./platform/router/preact.tsx";
import { AUTO_BASE_HREF } from "./platform/router/router.ts";
import { HomePage } from "./pages/home/home-page.tsx";
import { NotFoundPage } from "./pages/not-found/home-page.tsx";
import { Provider } from "./platform/preact/provider.ts";
import { Decimal } from "decimal.js";
import { PageBody } from "./sections/page-body/page-body.tsx";
import { DataSource } from "./platform/data-source/data-source.ts";
import { SideBarLeft } from "./sections/side-bar-left/side-bar-left.tsx";
import { AccountsDetailPage } from "./pages/accounts-detail/accounts-detail.tsx";
import { DashboardPage } from "./pages/dashboard/dashboard.tsx";
import { BudgetPage } from "./pages/budget/budget.tsx";
import { QueryPage } from "./pages/query/query.tsx";
import { AccountsPage } from "./pages/accounts/accounts.tsx";

const provider = new Provider();

const dataSource = new DataSource()
provider.provide(DataSource, dataSource)

const app = new PreactRouter({
  root: document.body,
  baseHref: AUTO_BASE_HREF,
  providers: [<Provider.Provider value={provider} />, <Wrapper />],
});

function Wrapper({ children }: any) {
  return (
    <Fragment>
      <SideBarLeft />
      <PageBody>{children}</PageBody>
    </Fragment>
  );
}

app.mount(["/", "/index.html"], () => <HomePage />);
app.mount("/dashboard", () => <DashboardPage />);
app.mount("/budget", () => <BudgetPage />);
app.mount("/query", () => <QueryPage />);
app.mount("/accounts", () => <AccountsPage />);
app.mount("/accounts/:id", () => <AccountsDetailPage />);

app.mount("/**", () => <NotFoundPage />);

app.start();

// @ts-expect-error
globalThis.ds = dataSource
// @ts-expect-error
globalThis.Decimal = Decimal;

void (async function () {
  // Demo Data
  const accWiseUS = await dataSource.createAccount({
    currencyCode: "USD",
    name: "Wise US",
  });

  const accCbaGeneral = await dataSource.createAccount({
    currencyCode: "AUD",
    name: "CBA General",
  });

  const accCbaSavings = await dataSource.createAccount({
    currencyCode: "AUD",
    name: "CBA Savings",
  });

  setTimeout(async () => {
    await dataSource.addTransactions(
      {
        accountId: accWiseUS,
        date: new Date().toISOString(),
        notes: "",
        category: "",
        credit: "10",
        debit: null,
      },
      {
        accountId: accWiseUS,
        date: new Date().toISOString(),
        notes: "",
        category: "",
        credit: "10",
        debit: null,
      },

      {
        accountId: accCbaGeneral,
        date: new Date().toISOString(),
        notes: "",
        category: "",
        credit: "50",
        debit: null,
      },
      {
        accountId: accCbaGeneral,
        date: new Date().toISOString(),
        notes: "",
        category: "",
        credit:"50",
        debit: null,
      },

      {
        accountId: accCbaSavings,
        date: new Date().toISOString(),
        notes: "",
        category: "",
        credit: "100",
        debit: null,
      },
    );
  }, 0)
})();
