import { formatTransaction, isTransaction } from 'pta-tools';
import { Api } from 'types';

import React, { FC } from 'react';

import { Code } from '@mantine/core';

export const OPTION_SPLITWISE = 'splitwise';

const Review: FC<{ journal: Api.BootstrapResponse }> = ({ journal }) => {
  return (
    <div>
      {journal.today.map((entry, index) => (
        <Code key={index} block mb="md">
          {isTransaction(entry) ? formatTransaction(entry) : JSON.stringify(entry)}
        </Code>
      ))}
    </div>
  );
};

export default Review;
