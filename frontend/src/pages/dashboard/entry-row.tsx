import { Comment, Posting, isComment } from 'pta-tools';

import React, { FC } from 'react';

import AsyncAutocomplete from 'atoms/async-autocomplete';

import { Autocomplete, Button, Group, Space, TextInput, createStyles } from '@mantine/core';

const useStyles = createStyles(theme => {
  return {
    wrapper: {
      alignItems: 'inherit',
      flexDirection: 'column',
      marginTop: '25px',
      [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
        alignItems: 'center',
        // Type safe child reference in nested selectors via ref
        flexDirection: 'row'
      }
    }
  };
});

const EntryRow: FC<{
  amountPlaceholder: string | null;
  canDelete: boolean;
  description: string | undefined;
  entry: Posting | Comment;
  removeRow: () => void;
  updateRow: (field: string, value: string) => void;
}> = ({ amountPlaceholder, canDelete, entry, removeRow, updateRow, description }) => {
  const { classes } = useStyles();
  if (isComment(entry)) {
    return null;
  }

  const params = ['sort=expenses'];
  if (description) {
    params.push(`description=${description}`);
  }

  return (
    <Group className={classes.wrapper}>
      <AsyncAutocomplete
        endpoint="/api/s/account"
        params={params.join('&')}
        placeholder="Account"
        value={entry.account}
        style={{ flex: 3 }}
        onChange={value => updateRow('account', value)}
      />
      <TextInput
        placeholder={amountPlaceholder || 'Amount'}
        value={entry.amount}
        style={{ flex: 2 }}
        onChange={event => updateRow('amount', event.currentTarget.value)}
      />
      <AsyncAutocomplete
        endpoint="/api/s/commodity"
        params={params.join('&')}
        placeholder="Commodity"
        value={entry.commodity || ''}
        style={{ flex: 1 }}
        onChange={value => updateRow('commodity', value)}
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
