import { isPosting, Transaction } from 'pta-tools';

type FixTransaction = (trx: Transaction) => Transaction;

// Removes empty entries
export const clearTransaction: FixTransaction = (trx) => {
  return {
    ...trx,
    entries: trx.entries.filter(
      (e) => isPosting(e) && !(e.account == "" && e.amount === "")
    ),
  };
};

// Removes empty entries
export const fixColons: FixTransaction = (trx) => {
  return {
    ...trx,
    entries: trx.entries.map((e) => {
      if (!isPosting(e)) {
        return e;
      }
      return {
        ...e,
        account: e.account.replace(/:\s+/g, ":"),
      };
    }),
  };
};

const compose =
  (...functions) =>
  (args) =>
    functions.reduceRight((arg, fn) => fn(arg), args);

const fixer: FixTransaction = compose(clearTransaction, fixColons);

export default fixer;
