import React, { FC } from 'react';

import getAssets from 'helpers/get-assets';

import AsyncAutocomplete from 'atoms/async-autocomplete';

import { createStyles, Group } from '@mantine/core';

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
  description: string | undefined;
  onChange: (value: string) => void;
  value?: string;
}> = ({ value, onChange, description }) => {
  const { classes } = useStyles();

  const params = ["sort=assets,liabilities"];
  if (description) {
    params.push(`description=${description}`);
  }

  return (
    <Group className={classes.wrapper}>
      <AsyncAutocomplete
        label="Paying account"
        params={params.join("&")}
        placeholder="Account"
        value={value || ""}
        endpoint="/api/s/account"
        style={{ flex: 1 }}
        onChange={(value) => onChange(value)}
      />
    </Group>
  );
};

export default PaymentAccount;
