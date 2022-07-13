import { Posting, Transaction } from 'pta-tools';

import { clearTransaction, fixColons } from './fix-transaction';

describe('clearTransaction', () => {
  test('Clears empty postings', () => {
    const trx: Transaction = {
      comment: 'comment',
      date: new Date('2019-01-01'),
      description: 'string',
      entries: [
        { account: '', amount: '' },
        { account: 'A', amount: '' },
        { account: '', amount: '123' }
      ]
    };

    expect(clearTransaction(trx).entries.length).toBe(2);
  });
});

describe('fixColons', () => {
  test('Clears empty spaces in accounts', () => {
    const trx: Transaction = {
      comment: 'comment',
      date: new Date('2019-01-01'),
      description: 'string',
      entries: [{ account: 'Expenses: Groceries', amount: '' }]
    };

    expect((fixColons(trx).entries[0] as Posting).account).toBe('Expenses:Groceries');
  });
});
