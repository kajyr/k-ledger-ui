import { Transaction } from 'pta-tools';

import getSortedAccountsMatchingDescr from './get-sorted-accounts-matching-descr';

function mockTransaction(account, description?): Transaction {
  return {
    description,
    date: new Date("2020-01-01"),
    entries: [{ account, amount: 3 }, { account: "Assets:Cash" }],
  };
}

describe("getSortedAccountsMatchingDescr", () => {
  const journal = [
    mockTransaction("Expenses:Bananas", "Supermarket"),
    mockTransaction("Expenses:Breakfast", "Bar"),
    mockTransaction("Expenses:Bananas", "Supermarket"),
    mockTransaction("Expenses:Bananas", "Supermarket"),
    mockTransaction("Expenses:Bananas", "Supermarket"),
    mockTransaction("Expenses:Breakfast", "cafeteria"),
    mockTransaction("Expenses:Lunch", "bar"),
    mockTransaction("Assets:Bank"),
    mockTransaction("Expenses:Groceries", "Supermarket"),
    mockTransaction("Expenses:Groceries", "Supermarket"),
  ];

  test("Returns sorted account list", () => {
    // Breakfast is first because it matches bar
    // even if it occurres less than Bananas
    // Bananas goes before Bank because it is used more often
    expect(
      getSortedAccountsMatchingDescr(journal, "b", "bar", undefined)
    ).toEqual(["Expenses:Breakfast", "Expenses:Bananas", "Assets:Bank"]);
  });

  test("With no query, just sort by descr", () => {
    // Breakfast is first because it matches bar
    // even if it occurres less than Bananas
    expect(
      getSortedAccountsMatchingDescr(journal, undefined, "bar", undefined)
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
      getSortedAccountsMatchingDescr(journal, undefined, "bar", ["expenses"])
    ).toEqual([
      "Expenses:Breakfast",
      "Expenses:Lunch", // this is used less, but matches bar
      "Expenses:Bananas", // this is used more, but does not match descr
      "Expenses:Groceries",
      "Assets:Cash", // This is used in every mock, but does not match sorting
      "Assets:Bank",
    ]);
  });
});
