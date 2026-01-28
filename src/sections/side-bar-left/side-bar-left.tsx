import "./side-bar-left.scss";
import { h } from "preact";
import { Icon } from "../../components/icon/icon.tsx";
import { PreactRouter, useRouter } from "../../platform/router/preact.tsx";
import { useInject } from "../../platform/preact/provider.ts";
import { DataSourceService } from "../../pages/services/data-source-service.ts";
import { useAsync, useViewModel } from "../../platform/rx/use-view-model.ts";
import { AccountDetail } from "../../platform/data-source/index.ts";
import { Decimal } from "decimal.js";
import { classNames } from "../../platform/preact/class-names.ts";
import { Observable } from "../../platform/rxjs/index.ts";
import { pipe } from "../../platform/rxjs/operators/pipe.ts";
import { map } from "../../platform/rxjs/operators/map.ts";

export class SideBarLeftViewModel {
  accounts: Observable<Array<AccountDetail>>;
  balance: Observable<Decimal>;
  #router: PreactRouter;

  constructor(router: PreactRouter, ds: DataSourceService) {
    this.#router = router;

    this.accounts = pipe(ds)(
      map(() => ds.getAccounts()),
      map((a) => Object.values(a)),
    );

    this.balance = pipe(this.accounts)(
      map((accounts) =>
        accounts.reduce((p, c) => p.add(c.balance), new Decimal(0)),
      ),
    );
  }

  navigate = (route: string) => {
    return {
      href: route,
      onClick: (e: MouseEvent) => {
        e.preventDefault();
        this.#router.navigate(route);
      },
    };
  };
}

export function SideBarLeft() {
  const router = useRouter();
  const dataSourceService = useInject(DataSourceService);
  const vm = useViewModel(SideBarLeftViewModel, [router, dataSourceService]);

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
          {...vm.navigate("/dashboard")}
          className={classNames("large", {
            active: router.req.path === "/dashboard",
          })}
        >
          Dashboard
        </a>
        <a
          {...vm.navigate("/budget")}
          className={classNames("large", {
            active: router.req.path === "/budget",
          })}
        >
          Budget
        </a>
        <a
          {...vm.navigate("/query")}
          className={classNames("large", {
            active: router.req.path === "/query",
          })}
        >
          Query
        </a>
      </section>
      <section>
        <a
          {...vm.navigate("/accounts")}
          className={classNames("account", "heading", {
            active: router.req.path === "/accounts",
          })}
        >
          <span>All Accounts</span>
          <span>{useAsync(vm.balance, new Decimal("0")).toFixed(0)}</span>
        </a>

        {useAsync(vm.accounts, [])
          .filter((a) => a.open)
          .map((account) => (
            <a
              {...vm.navigate(`/accounts/${account.accountId}`)}
              className={classNames("account", {
                active: router.req.path === `/accounts/${account.accountId}`,
              })}
            >
              <span>{account.name}</span>
              <span>{account.balance.toFixed(0)}</span>
            </a>
          ))}

        <br />
        <div className="account heading">
          <span>Closed Accounts</span>
          <span>0</span>
        </div>
        {useAsync(vm.accounts, [])
          .filter((a) => !a.open)
          .map((account) => (
            <a
              {...vm.navigate(`/accounts/${account.accountId}`)}
              className="account"
            >
              <span>{account.name}</span>
              <span>{account.balance.toFixed(0)}</span>
            </a>
          ))}
      </section>
    </nav>
  );
}
