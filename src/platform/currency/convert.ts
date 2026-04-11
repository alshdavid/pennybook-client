export async function convertCurrency(
  value: number,
  base: string,
  target: string,
): Promise<number> {
  const to = base.toLowerCase();
  const rate = (await fetchCurrencyCached(target))[to];
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


// async function fetchCurrency(code: string): Promise<Record<string, number>> {
//   const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${code.toLowerCase()}.json`;
//   const response = await fetch(url);
//   const data = await response.json();
//   return data[code]
// }

interface CacheEntry {
  data: Record<string, number>;
  timestamp: number;
}

const currencyCache = new Map<string, CacheEntry>();
const inflightRequests = new Map<string, Promise<Record<string, number>>>();
const CACHE_DURATION = 30 * 60 * 1000;

async function fetchCurrencyCached(code: string): Promise<Record<string, number>> {
  const lowerCode = code.toLowerCase();
  const now = Date.now();

  const cached = currencyCache.get(lowerCode);
  if (cached && (now - cached.timestamp < CACHE_DURATION)) {
    return cached.data;
  }

  const inflight = inflightRequests.get(lowerCode);
  if (inflight) {
    return inflight;
  }

  const fetchPromise = (async () => {
    try {
      const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${lowerCode}.json`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const result = data[lowerCode];

      currencyCache.set(lowerCode, { data: result, timestamp: Date.now() });
      return result;
    } finally {
      inflightRequests.delete(lowerCode);
    }
  })();

  inflightRequests.set(lowerCode, fetchPromise);
  return fetchPromise;
}
