import type { BudgetRange, Money } from "@sidequest-atlas/domain";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`));
}

export function formatDateRange(startDate: string, endDate: string): string {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function formatMoneyRange(budget: BudgetRange): string {
  const low = formatMinor(budget.lowMinor, budget.currency, budget.minorUnit);
  const high = formatMinor(budget.highMinor, budget.currency, budget.minorUnit);
  return low === high ? low : `${low} - ${high}`;
}

export function formatMoneyValue(money: Money, minorUnit = 2): string {
  return formatMinor(money.amountMinor, money.currency, minorUnit);
}

export function formatMinor(
  amountMinor: number,
  currency: string,
  minorUnit = 2,
): string {
  const amount = amountMinor / 10 ** minorUnit;
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: minorUnit === 0 ? 0 : 2,
  }).format(amount);
}

export function cityAccentClass(countryCode?: string): string {
  switch (countryCode) {
    case "NO":
      return "accent-no";
    case "SE":
      return "accent-se";
    case "FI":
      return "accent-fi";
    default:
      return "accent-neutral";
  }
}

export function slugifyLabel(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
