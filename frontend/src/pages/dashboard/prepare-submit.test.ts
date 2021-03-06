import { Posting } from 'pta-tools';

import { FormData, OPTION_SPLITWISE } from './';
import prepareSubmit from './prepare-submit';

describe('prepareSubmit', () => {
  test('Does not mutate the input trx', () => {
    const trx: FormData = {
      comment: 'comment',
      date: new Date('2019-01-01'),
      description: 'string',
      entries: [{ account: 'Bar', amount: '7' }],
      payingAccount: 'Cash'
    };

    expect(prepareSubmit(trx, []).entries.length).toBe(2);
    expect(trx.entries.length).toBe(1); // trx.entries is not mutated
  });
  test('Splits with Splitwise', () => {
    const trx: FormData = {
      comment: 'comment',
      date: new Date('2019-01-01'),
      description: 'string',
      entries: [{ account: 'Bar', amount: '7.13' }],
      payingAccount: 'Cash'
    };

    const result = prepareSubmit(trx, [OPTION_SPLITWISE]);
    expect(result.entries.length).toBe(3);
    expect((result.entries[0] as Posting).amount).toBe(3.56);
    expect((result.entries[1] as Posting).amount).toBe(3.57);
    expect((result.entries[2] as Posting).account).toBe('Cash');
  });
});
