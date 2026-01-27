import "./side-bar-left.scss";
import { h } from "preact";
import { Icon } from "../../components/icon/icon.tsx";
import { useRouter } from "../../platform/router/preact.tsx";
import { useInject } from "../../platform/preact/provider.ts";
import { DataSourceService } from "../../pages/services/data-source-service.ts";
import { useEffect } from "preact/hooks";
import { useViewModel } from "../../platform/rx/use-view-model.ts";
import { AccountDetail } from "../../platform/data-source/index.ts";
import { rx } from "../../platform/rx/rx.ts";
import {Decimal} from "decimal.js";

export class SideBarLeftViewModel extends EventTarget {
  @rx accessor accounts: Array<AccountDetail>;
  @rx accessor ds: DataSourceService;
  @rx accessor balance: Decimal

  constructor(ds: DataSourceService) {
    super();
    this.ds = ds;
    this.accounts = [];
    this.balance = new Decimal('0')
  }

  async onInit() {
    this.accounts = Object.values(await this.ds.getAccounts());
    this.balance = new Decimal(this.accounts.reduce((p, c) => p.add(c.balance), new Decimal(0)))
  }
}

export function SideBarLeft() {
  const router = useRouter();
  const dataSourceService = useInject(DataSourceService);
  const vm = useViewModel(SideBarLeftViewModel, [dataSourceService]);

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
        <a {...navigate("/dashboard")} className="large active">
          Dashboard
        </a>
        <a {...navigate("/budget")} className="large">
          Budget
        </a>
        <a {...navigate("/query")} className="large">
          Query
        </a>
      </section>
      <section>
        <a {...navigate("/accounts")} className="account heading">
          <span>All Accounts</span>
          <span>100,000</span>
        </a>

        {vm.accounts.filter(a => a.open).map((account) => (
          <a
            {...navigate(`/accounts/${account.accountId}`)}
            className="account"
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
        {vm.accounts.filter(a => !a.open).map((account) => (
          <a
            {...navigate(`/accounts/${account.accountId}`)}
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
