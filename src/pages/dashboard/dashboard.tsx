import { Fragment, h } from "preact";
import { useAsync, useViewModel } from "../../platform/rx/use-view-model.ts";
import { merge, Observable, of } from "../../platform/rxjs/index.ts";
import { Decimal } from "decimal.js";
import { useInject } from "../../platform/preact/provider.ts";
import { DataSourceService } from "../services/data-source-service.ts";
import { pipe } from "../../platform/rxjs/operators/pipe.ts";
import { map } from "../../platform/rxjs/operators/map.ts";
import {
  convertCurrency,
  getCurrencySymbol,
} from "../../platform/currency/convert.ts";

// TODO: Set in user settings
const DEFAULT_CURRENCY = "AUD";

class DashboardViewModel {
  netWorth: Observable<Decimal>;
  byCurrency: Observable<Record<string, Decimal>>;

  constructor(ds: DataSourceService) {
    this.netWorth = pipe(merge(of(ds), ds))(
      map(async () => {
        let result = new Decimal("0");

        for (const account of Object.values(await ds.getAccounts())) {
          if (account.currencyCode !== DEFAULT_CURRENCY) {
            result = result.add(
              await convertCurrency(
                account.balance.toNumber(),
                DEFAULT_CURRENCY,
                account.currencyCode,
              ),
            );
          } else {
            result = result.add(account.balance);
          }
        }

        return result;
      }),
      map((x) => x),
    );

    this.byCurrency = pipe(merge(of(ds), ds))(
      map(async () => {
        let result: Record<string, Decimal> = {};

        for (const account of Object.values(await ds.getAccounts())) {
          result[account.currencyCode] =
            result[account.currencyCode] || new Decimal("0");
          result[account.currencyCode] = result[account.currencyCode].add(
            account.balance,
          );
        }

        return result;
      }),
      map((x) => x),
    );

    // this.byCurrency.subscribe(x => console.log(x.USD.toNumber()))
  }
}

export function DashboardPage() {
  const ds = useInject(DataSourceService);
  const vm = useViewModel(DashboardViewModel, [ds]);

  return (
    <Fragment>
      <h2>Account Totals</h2>
      <h3>Default Currency {DEFAULT_CURRENCY}</h3>

      <table>
        {Object.entries(useAsync(vm.byCurrency, {})).map(([code, balance]) => (
          <tr>
            <td>
              {getCurrencySymbol(code)}
              {balance.toFixed(2)}
            </td>
            <td>{code}</td>
          </tr>
        ))}
        <tr>
          <th>
            {getCurrencySymbol(DEFAULT_CURRENCY)}
            {useAsync(vm.netWorth, new Decimal("0")).toFixed(2)}
          </th>
          <th>Estimated {DEFAULT_CURRENCY}</th>
        </tr>
      </table>
    </Fragment>
  );
}
