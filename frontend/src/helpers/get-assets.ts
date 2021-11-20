function getAssets(accounts: string[]) {
  return accounts.filter((a) => a.startsWith("Assets:"));
}

export default getAssets;
