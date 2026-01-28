import { Fragment, h } from "preact";
import { useViewModel } from "../../platform/rx/use-view-model.ts";
import { useInject } from "../../platform/preact/provider.ts";
import { DataSourceService } from "../services/data-source-service.ts";

export class AccountsDetailPageViewModel {
  ds: DataSourceService;

  constructor(ds: DataSourceService) {
    this.ds = ds;
  }

  async onInit() {
    console.log((await this.ds.getTransactions().next()).value);
  }
}

export function AccountsDetailPage() {
  const dataSourceService = useInject(DataSourceService);
  const vm = useViewModel(AccountsDetailPageViewModel, [dataSourceService]);

  return (
    <Fragment>
      <div>Accounts Detail page</div>
    </Fragment>
  );
}
