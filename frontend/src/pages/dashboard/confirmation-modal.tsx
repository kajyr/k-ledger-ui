import React, { FC } from 'react';

import clearTransaction from 'helpers/clear-transaction';

import { Button, Code, Group, Modal } from '@mantine/core';

import { formatTransaction, Transaction } from 'pta-js';

const ConfirmationModal: FC<{
  data: Transaction;
  onCancel: () => void;
  onConfirm: (data: Transaction) => void;
}> = ({ data, onCancel, onConfirm }) => {
  const clean = clearTransaction(data);
  const trxstr = formatTransaction(clean);
  return (
    <Modal opened={true} onClose={onCancel} title="Confirm transaction">
      <Code block>{trxstr}</Code>
      <Group position="right" style={{ marginTop: 25 }}>
        <Button variant="white" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onConfirm(clean)}>Confirm</Button>
      </Group>
    </Modal>
  );
};

export default ConfirmationModal;
