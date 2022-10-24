import React, { FC } from 'react';

import { formatTransaction, isTransaction } from 'pta-tools';
import { Api } from 'types';

import { Code, Text } from '@mantine/core';

export const OPTION_SPLITWISE = 'splitwise';

const Review: FC<{ journal: Api.BootstrapResponse }> = ({ journal }) => {
  if (journal.today.length === 0) {
    return <Text mt="md">No expenses for today yet</Text>;
  }

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
