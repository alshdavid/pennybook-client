import { Fragment, h } from "preact";
import { DataSource } from "../../platform/data-source/data-source.ts";
import { useInject } from "../../platform/preact/provider.ts";
import { useAsync } from "../../platform/mvvm/preact/use-async.ts";

export function HomePage() {
  const ds = useInject(DataSource);
  const accounts = useAsync(ds.accounts, {});
  const transactions = useAsync(ds.transactions, {});

  return (
    <Fragment>
      <div>Home page</div>
      {Object.entries(accounts).map(([id, acc]) => {
        return (
          <div>
            <div>{id}</div>
            <div>
              {Object.entries(transactions)
                .filter(([_, tx]) => tx.accountId === id)
                .map(([tx_id, tx]) => {
                  return <div>TX: {tx_id}</div>;
                })}
            </div>
          </div>
        );
      })}
    </Fragment>
  );
}
