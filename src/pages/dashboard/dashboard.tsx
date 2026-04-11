import { Fragment, h } from "preact";
import { Decimal } from "decimal.js";
import { useInject } from "../../platform/preact/provider.ts";
import {
  convertCurrency,
  getCurrencySymbol,
} from "../../platform/currency/convert.ts";
import { DataSource } from "../../platform/data-source/data-source.ts";
import { useAsync, usePromise } from "../../platform/mvvm/preact/use-async.ts";
import { useMemo } from "preact/hooks";

// TODO: Set in user settings
const DEFAULT_CURRENCY = "AUD";

export function DashboardPage() {
  const ds = useInject(DataSource);
  const accounts = useAsync(ds.accounts, {});

  const netWorth: Decimal = usePromise(
    async () => {
      let result = new Decimal("0");

      for (const account of Object.values(accounts)) {
        if (account.currencyCode !== DEFAULT_CURRENCY) {
          result = netWorth.add(
            await convertCurrency(
              new Decimal(account.balance).toNumber(),
              DEFAULT_CURRENCY,
              account.currencyCode,
            ),
          );
        } else {
          result = result.add(account.balance);
        }
      }

      return result;
    },
    new Decimal(0),
    [accounts],
  );

  const byCurrency: Record<string, Decimal> = useMemo(() => {
    let result: Record<string, Decimal> = {};

    for (const account of Object.values(accounts)) {
      result[account.currencyCode] =
        result[account.currencyCode] || new Decimal("0");
      result[account.currencyCode] = result[account.currencyCode].add(
        account.balance,
      );
    }

    return result;
  }, [accounts]);

  return (
    <Fragment>
      <h2>Account Totals</h2>
      <h3>Default Currency {DEFAULT_CURRENCY}</h3>

      <table>
        {Object.entries(byCurrency).map(([code, balance]) => (
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
            {netWorth.toFixed(2)}
          </th>
          <th>Estimated {DEFAULT_CURRENCY}</th>
        </tr>
      </table>
    </Fragment>
  );
}
