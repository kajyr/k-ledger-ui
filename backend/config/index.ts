import dayjs from 'dayjs';
import { JournalEntries } from 'pta-tools/build/types';

import { filename, readFile } from '../dal';

function isTodayEntry(entry: JournalEntries) {
  return 'date' in entry && dayjs().isSame(entry.date, 'day');
}

export default function (fastify, opts, done) {
  const routes = [
    {
      handler: async function () {
        const data = await readFile();

        const today = data.journal.filter(isTodayEntry);

        return {
          accounts: data.accounts,
          commodities: data.commodities,
          file: filename,
          today
        };
      },
      method: 'GET',
      url: `/api/bootstrap`
    }
  ];

  for (const route of routes) {
    fastify.route(route);
  }

  done();
}
