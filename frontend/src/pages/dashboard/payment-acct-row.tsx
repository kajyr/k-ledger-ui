import React, { FC } from 'react';

import getAssets from 'helpers/get-assets';

import { Autocomplete, createStyles, Group } from '@mantine/core';

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

const PaymentAccount: FC<{
  accounts: string[];
  value?: string;
  onChange: (value: string) => void;
}> = ({ accounts, value, onChange }) => {
  const { classes } = useStyles();
  return (
    <Group className={classes.wrapper}>
      <Autocomplete
        label="Paying account"
        placeholder="Account"
        value={value || ""}
        data={accounts}
        style={{ flex: 1 }}
        filter={(value, item) =>
          item.value.toLowerCase().includes(value.toLowerCase().trim())
        }
        onChange={(value) => onChange(value)}
      />
    </Group>
  );
};

export default PaymentAccount;
