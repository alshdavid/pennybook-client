import "./account-detail.scss";
import { Fragment, h } from "preact";
import { useAsync, useViewModel } from "../../platform/rx/use-view-model.ts";
import { useInject } from "../../platform/preact/provider.ts";
import { DataSourceService } from "../services/data-source-service.ts";
import { PreactRouter, useRouter } from "../../platform/router/preact.tsx";
import {
  AccountDetail,
  TransactionDetail,
} from "../../platform/data-source/index.ts";
import { pipe } from "../../platform/rxjs/operators/pipe.ts";
import { map } from "../../platform/rxjs/operators/map.ts";
import { fromEvent, merge, Observable, of } from "../../platform/rxjs/index.ts";

export class AccountsDetailPageViewModel {
  id: Observable<string>;
  transactions: Observable<Array<TransactionDetail>>;
  account: Observable<AccountDetail>;

  constructor(router: PreactRouter, ds: DataSourceService) {
    this.id = merge(
      of(router.req.params.id),
      pipe(fromEvent(router, "change"))(map(() => router.req.params.id)),
    );

    this.account = pipe(merge(this.id, ds))(
      map(async () => (await ds.getAccounts())[router.req.params.id]),
      map((x) => x),
    );

    this.transactions = pipe(merge(of(router.req.params.id), this.id, ds))(
      map(
        async () =>
          (await ds.getTransactions(router.req.params.id).next()).value,
      ),
      map((x) => x),
    );
  }
}

export function AccountsDetailPage() {
  const router = useRouter();
  const dataSourceService = useInject(DataSourceService);
  const vm = useViewModel(AccountsDetailPageViewModel, [
    router,
    dataSourceService,
  ]);

  return (
    <Fragment>
      <header>
        <h1>{useAsync(vm.account, null)?.name} </h1>
        <h2>
          ${useAsync(vm.account, null)?.balance.toFixed(2)}{" "}
          <small>{useAsync(vm.account, null)?.currencyCode}</small>
        </h2>
      </header>
      <table>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Payee</th>
            <th scope="col">Notes</th>
            <th scope="col">Category</th>
            <th scope="col">Debit</th>
            <th scope="col">Credit</th>
          </tr>
        </thead>
        <tbody>
          {useAsync(vm.transactions, []).map((t) => (
            <tr>
              <td scope="col">{t.date}</td>
              <td scope="col"></td>
              <td scope="col">{t.notes}</td>
              <td scope="col">{t.category}</td>
              <td scope="col">{t.debit?.toFixed(2)}</td>
              <td scope="col">{t.credit?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
}
