import React, { FC } from 'react';

import { Autocomplete, Button, createStyles, Group, Space, TextInput } from '@mantine/core';

import { TransactionEntry } from 'pta-journal';

const useStyles = createStyles((theme) => {
  return {
    wrapper: {
      marginTop: "25px",
      flexDirection: "column",
      alignItems: "inherit",
      [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
        // Type safe child reference in nested selectors via ref
        flexDirection: "row",
        alignItems: "center",
      },
    },
  };
});

const EntryRow: FC<{
  accounts: string[];
  canDelete: boolean;
  commodities: string[];
  entry: TransactionEntry;
  removeRow: () => void;
  updateRow: (field: string, value: string) => void;
}> = ({ accounts, canDelete, commodities, entry, removeRow, updateRow }) => {
  const { classes } = useStyles();
  return (
    <Group className={classes.wrapper}>
      <Autocomplete
        placeholder="Account"
        value={entry.account}
        style={{ flex: 3 }}
        data={accounts}
        filter={(value, item) =>
          item.value.toLowerCase().includes(value.toLowerCase().trim())
        }
        onChange={(value) => updateRow("account", value)}
      />
      <TextInput
        placeholder="Amount"
        value={entry.amount}
        style={{ flex: 2 }}
        onChange={(event) => updateRow("amount", event.currentTarget.value)}
      />
      <Autocomplete
        placeholder="Commodity"
        value={entry.commodity}
        style={{ flex: 1 }}
        onChange={(value) => updateRow("commodity", value)}
        data={commodities}
        filter={(value, item) =>
          item.value.toLowerCase().includes(value.toLowerCase().trim())
        }
      />
      {canDelete ? (
        <Button compact onClick={removeRow} variant="link">
          Remove
        </Button>
      ) : (
        <Space w={52} />
      )}
    </Group>
  );
};

export default EntryRow;