import { JournalEntries } from 'pta-tools/build/types';

export namespace Api {
  export type BootstrapResponse = {
    file: string;
    accounts: string[];
    commodities: string[];
    today: JournalEntries[];
  };
}
