export async function convertCurrency(
  value: number,
  base: string,
  target: string,
): Promise<number> {
  const from = target.toLowerCase();
  const to = base.toLowerCase();

  const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from}.json`;

  const response = await fetch(url);
  const data = await response.json();
  const rate = data[from][to];

  return value * rate;
}

export function getCurrencySymbolLocale(
  locale: string,
  currencyCode: string,
): string {
  return (0)
    .toLocaleString(locale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, "")
    .trim();
}

export function getCurrencySymbol(currencyCode: string): string | undefined {
  return {
    USD: "$",
    AUD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
  }[currencyCode];
}
