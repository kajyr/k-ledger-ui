import React, { FC } from 'react';

import AsyncAutocomplete from 'atoms/async-autocomplete';

import { Autocomplete, Button, createStyles, Group, Space, TextInput } from '@mantine/core';

import { Comment, isComment, Posting } from 'pta-tools';

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
  amountPlaceholder: string | null;
  canDelete: boolean;
  commodities: string[];
  description: string | undefined;
  entry: Posting | Comment;
  removeRow: () => void;
  suggestedCommodity: string | undefined;
  updateRow: (field: string, value: string) => void;
}> = ({
  accounts,
  amountPlaceholder,
  canDelete,
  commodities,
  entry,
  suggestedCommodity,
  removeRow,
  updateRow,
  description,
}) => {
  const { classes } = useStyles();
  if (isComment(entry)) {
    return null;
  }

  const params = ["sort=expenses"];
  if (description) {
    params.push(`description=${description}`);
  }

  return (
    <Group className={classes.wrapper}>
      <AsyncAutocomplete
        endpoint="/api/s/account"
        params={params.join("&")}
        placeholder="Account"
        value={entry.account}
        style={{ flex: 3 }}
        onChange={(value) => updateRow("account", value)}
      />
      <TextInput
        placeholder={amountPlaceholder || "Amount"}
        value={entry.amount}
        style={{ flex: 2 }}
        onChange={(event) => updateRow("amount", event.currentTarget.value)}
      />
      <Autocomplete
        placeholder={suggestedCommodity || "Commodity"}
        value={entry.commodity}
        style={{ flex: 1 }}
        onChange={(value) => updateRow("commodity", value)}
        data={commodities}
        filter={(value, item) =>
          item.value.toLowerCase().includes(value.toLowerCase().trim())
        }
      />
      {canDelete ? (
        <Button compact onClick={removeRow} variant="outline">
          Remove
        </Button>
      ) : (
        <Space w={71} />
      )}
    </Group>
  );
};

export default EntryRow;
