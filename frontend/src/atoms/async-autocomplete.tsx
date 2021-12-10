import React, { FC } from 'react';
import { useQuery } from 'react-query';

import { Autocomplete, AutocompleteProps } from '@mantine/core';

type Props = Omit<AutocompleteProps, "data"> & { endpoint: string };

type Suggestions = string[];

const AsyncAutocomplete: FC<Props> = ({ endpoint, ...props }) => {
  const { isLoading, error, data } = useQuery<Suggestions>(
    [endpoint, props.value],
    () => {
      const val = props.value || "";
      if (val.length > 1) {
        return fetch(`${endpoint}/${props.value}`).then((res) => res.json());
      }
      return Promise.resolve([]);
    },
    { retry: false }
  );

  return <Autocomplete {...props} data={data || []} />;
};

export default AsyncAutocomplete;
