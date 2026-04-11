import "./account-detail.scss";
import { Fragment, h } from "preact";
import { useInject } from "../../platform/preact/provider.ts";
import { useRouter } from "../../platform/router/preact.tsx";
import { fromEvent, map, merge, of } from "rxjs";
import { DataSource } from "../../platform/data-source/data-source.ts";
import { useAsync } from "../../platform/mvvm/preact/use-async.ts";

export function AccountsDetailPage() {
  const router = useRouter();
  const ds = useInject(DataSource);
  const accounts = useAsync(ds.accounts, {});
  const transactions = useAsync(ds.transactions, {});

  const id = useAsync(
    merge(
      of(router.req.params.id),
      fromEvent(router, "change").pipe(map(() => router.req.params.id)),
    ),
    router.req.params.id,
  );

  const account = accounts[id];

  return (
    <Fragment>
      <header>
        <h1>{account?.name} </h1>
        <h2>
          ${account?.balance} <small>{account?.currencyCode}</small>
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
          {Object.values(transactions)
            .filter((tx) => tx.accountId === id)
            .map((tx) => (
              <tr>
                <td scope="col">{tx.date}</td>
                <td scope="col"></td>
                <td scope="col">{tx.notes}</td>
                <td scope="col">{tx.category}</td>
                <td scope="col">{tx.debit}</td>
                <td scope="col">{tx.credit}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Fragment>
  );
}
