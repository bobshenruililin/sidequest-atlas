import { z } from "zod";
import { ConfidenceSchema, CurrencyCodeSchema, DateStringSchema } from "./primitives.js";

/** Integer minor-unit money — never use floating point for arithmetic */
export const MoneySchema = z.object({
  amountMinor: z.number().int(),
  currency: CurrencyCodeSchema,
});
export type Money = z.infer<typeof MoneySchema>;

export const BudgetRangeSchema = z.object({
  lowMinor: z.number().int().nonnegative(),
  highMinor: z.number().int().nonnegative(),
  currency: CurrencyCodeSchema,
  minorUnit: z.number().int().min(0).max(4).default(2),
  includes: z.array(z.string()).default([]),
  excludes: z.array(z.string()).default([]),
  confidence: ConfidenceSchema,
});
export type BudgetRange = z.infer<typeof BudgetRangeSchema>;

export const ExchangeRateSchema = z.object({
  baseCurrency: CurrencyCodeSchema,
  quoteCurrency: CurrencyCodeSchema,
  /** Decimal string — never binary float for rates */
  rate: z.string().regex(/^\d+(\.\d+)?$/),
  effectiveDate: DateStringSchema,
  sourceId: z.string().optional(),
  enteredManually: z.boolean(),
});
export type ExchangeRate = z.infer<typeof ExchangeRateSchema>;

export function assertSameCurrency(a: string, b: string, context: string): void {
  if (a !== b) {
    throw new Error(`Currency mismatch in ${context}: ${a} vs ${b}`);
  }
}

export function addMoney(a: Money, b: Money): Money {
  assertSameCurrency(a.currency, b.currency, "addMoney");
  return { amountMinor: a.amountMinor + b.amountMinor, currency: a.currency };
}

export function sumMoney(items: Money[], currency: string): Money {
  let total = 0;
  for (const item of items) {
    assertSameCurrency(item.currency, currency, "sumMoney");
    total += item.amountMinor;
  }
  return { amountMinor: total, currency };
}

export function formatMoney(money: Money, minorUnit = 2): string {
  const factor = 10 ** minorUnit;
  const whole = money.amountMinor / factor;
  return `${whole.toFixed(minorUnit)} ${money.currency}`;
}

/** Convert using a decimal string rate; rounds half-away-from-zero to integer minor units */
export function convertMoney(
  money: Money,
  rate: ExchangeRate,
  targetMinorUnit = 2,
): { converted: Money; rate: ExchangeRate } {
  if (money.currency !== rate.baseCurrency) {
    throw new Error(
      `FX base mismatch: money is ${money.currency}, rate base is ${rate.baseCurrency}`,
    );
  }
  const [intPart, frac = ""] = rate.rate.split(".");
  const rateScale = frac.length;
  const rateInt = BigInt(intPart + frac.padEnd(rateScale, "0"));
  const scale = 10n ** BigInt(rateScale);
  const raw = BigInt(money.amountMinor) * rateInt;
  const half = scale / 2n;
  const convertedMinor =
    raw >= 0n ? Number((raw + half) / scale) : Number((raw - half) / scale);
  // Adjust if minor units differ — assume same minor unit for v1 display
  void targetMinorUnit;
  return {
    converted: { amountMinor: convertedMinor, currency: rate.quoteCurrency },
    rate,
  };
}
