import "./side-bar-left.scss";
import { h } from "preact";
import { Icon } from "../../components/icon/icon.tsx";
import { useRouter } from "../../platform/router/preact.tsx";
import { useInject } from "../../platform/preact/provider.ts";
import { classNames } from "../../platform/preact/class-names.ts";
import { getCurrencySymbol } from "../../platform/currency/convert.ts";
import { DataSource } from "../../platform/data-source/data-source.ts";
import { useAsync } from "../../platform/mvvm/preact/use-async.ts";
import { Decimal } from "decimal.js";

// TODO: Set in user settings
const DEFAULT_CURRENCY = "AUD";

export function SideBarLeft() {
  const router = useRouter();
  const ds = useInject(DataSource);
  const accounts = useAsync(ds.accounts, {});

  function navigate(route: string) {
    return {
      href: route,
      onClick: (e: MouseEvent) => {
        e.preventDefault();
        router.navigate(route);
      },
    };
  }

  return (
    <nav className="side-bar-left">
      <div className="top-bar">
        <div className="logo">
          <Icon icon="brand-hollow" />
          <span>pennybook</span>
        </div>
      </div>
      <section>
        <a
          {...navigate("/dashboard")}
          className={classNames("large", {
            active: router.req.path === "/dashboard",
          })}
        >
          Dashboard
        </a>
        <a
          {...navigate("/budget")}
          className={classNames("large", {
            active: router.req.path === "/budget",
          })}
        >
          Budget
        </a>
        <a
          {...navigate("/query")}
          className={classNames("large", {
            active: router.req.path === "/query",
          })}
        >
          Query
        </a>
      </section>
      <section>
        <a
          {...navigate("/accounts")}
          className={classNames("account", "heading", {
            active: router.req.path === "/accounts",
          })}
        >
          <span>All Accounts</span>
          <span>
            {getCurrencySymbol(DEFAULT_CURRENCY)}
            {Object.values(accounts)
              .reduce((p, c) => p.plus(new Decimal(c.balance)), new Decimal(0))
              .toFixed(0)}
          </span>
        </a>

        {Object.values(accounts)
          .filter((a) => a.open)
          .map((account) => (
            <a
              {...navigate(`/accounts/${account.accountId}`)}
              className={classNames("account", {
                active: router.req.path === `/accounts/${account.accountId}`,
              })}
            >
              <span>{account.name}</span>
              <span>
                {getCurrencySymbol(account.currencyCode)}
                {account.balance}
              </span>
            </a>
          ))}

        <br />
        <div className="account heading">
          <span>Closed Accounts</span>
          <span>0</span>
        </div>
        {Object.values(accounts)
          .filter((a) => !a.open)
          .map((account) => (
            <a
              {...navigate(`/accounts/${account.accountId}`)}
              className="account"
            >
              <span>{account.name}</span>
              <span>{account.balance}</span>
            </a>
          ))}
      </section>
    </nav>
  );
}
