import { Transaction } from "pta-tools";

import getSortedAccountsMatchingDescr from "./get-sorted-accounts-matching-descr";

function mockTransaction(account, description, commodity): Transaction {
  return {
    description,
    date: new Date("2020-01-01"),
    entries: [{ account, amount: 3, commodity }, { account: "Assets:Cash" }],
  };
}

describe("getSortedAccountsMatchingDescr", () => {
  const journal = [
    mockTransaction("Expenses:Bananas", "Supermarket", "EUR"),
    mockTransaction("Expenses:Breakfast", "Bar", "EUR"),
    mockTransaction("Expenses:Bananas", "Supermarket", "EUR"),
    mockTransaction("Expenses:Bananas", "Supermarket", "USD"),
    mockTransaction("Expenses:Bananas", "Supermarket", "USD"),
    mockTransaction("Expenses:Breakfast", "cafeteria", "EUR"),
    mockTransaction("Expenses:Lunch", "bar", "USD"),
    mockTransaction("Assets:Bank", undefined, "EUR"),
    mockTransaction("Expenses:Groceries", "Supermarket", "EUR"),
    mockTransaction("Expenses:Groceries", "Supermarket", "ETH"),
  ];

  test("Returns sorted account list", () => {
    // Breakfast is first because it matches bar
    // even if it occurres less than Bananas
    // Bananas goes before Bank because it is used more often
    expect(
      getSortedAccountsMatchingDescr(journal, "b", "bar", "account")
    ).toEqual(["Expenses:Breakfast", "Expenses:Bananas", "Assets:Bank"]);
  });

  test("With no query, just sort by descr", () => {
    // Breakfast is first because it matches bar
    // even if it occurres less than Bananas
    expect(
      getSortedAccountsMatchingDescr(journal, undefined, "bar", "account")
    ).toEqual([
      "Assets:Cash", // This is used in every mock, so first
      "Expenses:Breakfast",
      "Expenses:Lunch", // this is used less, but matches bar
      "Expenses:Bananas", // this is used more, but does not match descr
      "Expenses:Groceries",
      "Assets:Bank",
    ]);
  });

  test("With no query, just sort by descr AND sorting key", () => {
    // Breakfast is first because it matches bar
    // even if it occurres less than Bananas
    expect(
      getSortedAccountsMatchingDescr(journal, undefined, "bar", "account", [
        "expenses",
      ])
    ).toEqual([
      "Expenses:Breakfast",
      "Expenses:Lunch", // this is used less, but matches bar
      "Expenses:Bananas", // this is used more, but does not match descr
      "Expenses:Groceries",
      "Assets:Cash", // This is used in every mock, but does not match sorting
      "Assets:Bank",
    ]);
  });

  test("Extracts commodities", () => {
    // Breakfast is first because it matches bar
    // even if it occurres less than Bananas
    // Bananas goes before Bank because it is used more often
    expect(
      getSortedAccountsMatchingDescr(journal, "e", "bar", "commodity")
    ).toEqual(["EUR", "ETH"]);
  });
});
