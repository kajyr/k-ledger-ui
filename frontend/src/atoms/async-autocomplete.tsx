import React, { FC, useState } from 'react';
import { useQuery } from 'react-query';

import { Autocomplete, AutocompleteProps } from '@mantine/core';

type Props = Omit<AutocompleteProps, "data"> & {
  endpoint: string;
  params?: string;
};

type Suggestions = string[];

const AsyncAutocomplete: FC<Props> = ({ endpoint, params, ...props }) => {
  const [isOpen, setOpen] = useState(false);
  const { data } = useQuery<Suggestions>(
    [endpoint, props.value, params],
    () => {
      return fetch(
        `${endpoint}/${props.value}${params ? `?${params}` : ""}`
      ).then((res) => res.json());
    },
    { retry: false, enabled: isOpen }
  );
  return (
    <Autocomplete
      {...props}
      data={data || []}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    />
  );
};

export default AsyncAutocomplete;
