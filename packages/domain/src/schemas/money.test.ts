import { describe, expect, it } from "vitest";
import {
  addMoney,
  convertMoney,
  formatMoney,
  sumMoney,
} from "./money.js";

describe("money", () => {
  it("adds same currency", () => {
    expect(
      addMoney(
        { amountMinor: 3500, currency: "EUR" },
        { amountMinor: 2000, currency: "EUR" },
      ),
    ).toEqual({ amountMinor: 5500, currency: "EUR" });
  });

  it("rejects mixed currencies", () => {
    expect(() =>
      addMoney(
        { amountMinor: 100, currency: "EUR" },
        { amountMinor: 100, currency: "SEK" },
      ),
    ).toThrow(/Currency mismatch/);
  });

  it("sums and formats", () => {
    const total = sumMoney(
      [
        { amountMinor: 1000, currency: "NOK" },
        { amountMinor: 2500, currency: "NOK" },
      ],
      "NOK",
    );
    expect(total.amountMinor).toBe(3500);
    expect(formatMoney(total)).toBe("35.00 NOK");
  });

  it("converts with string rates", () => {
    const { converted } = convertMoney(
      { amountMinor: 10000, currency: "EUR" },
      {
        baseCurrency: "EUR",
        quoteCurrency: "SEK",
        rate: "11.50",
        effectiveDate: "2026-07-16",
        enteredManually: true,
      },
    );
    expect(converted.currency).toBe("SEK");
    expect(converted.amountMinor).toBe(115000);
  });
});
