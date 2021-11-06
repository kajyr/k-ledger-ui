declare var __VERSION__: string;

export namespace Api {
  export type BootstrapResponse = {
    file: string;
    accounts: string[];
    commodities: string[];
  };
}
