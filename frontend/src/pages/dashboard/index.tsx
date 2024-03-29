import React, { FC, useState } from 'react';

import { callApi } from 'helpers/api';
import { isToday } from 'helpers/dates';
import { Posting, Transaction } from 'pta-tools';
import { Api } from 'types';

import AsyncAutocomplete from 'atoms/async-autocomplete';

import { Button, Chip, Group, LoadingOverlay, Modal, Text } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';

import ConfirmationModal from './confirmation-modal';
import EntryRow from './entry-row';
import PaymentAccount from './payment-acct-row';
import prepareSubmitData from './prepare-submit';

export const OPTION_SPLITWISE = 'splitwise';

export type FormData = Transaction & {
  payingAccount?: string;
};

const Dashboard: FC<{ journal: Api.BootstrapResponse }> = ({ journal }) => {
  const [options, setOptions] = useState<string[]>([]);

  const emptyEntry: Posting = {
    account: '',
    amount: '',
    commodity: journal.commodities.length === 1 ? journal.commodities[0] : ''
  };

  const { onSubmit, values, setFieldValue, removeListItem, reset, insertListItem } = useForm<FormData>({
    initialValues: {
      date: new Date(),
      description: '',
      entries: [emptyEntry]
    }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [showOverlay, setOverlay] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const handleSubmit = () => {
    setModalOpen(true);
  };

  function addRow() {
    insertListItem('entries', { ...emptyEntry });
  }

  function updateRow(idx: number) {
    return (field: string, value: string) => {
      setFieldValue(`entries.${idx}.${field}`, value);
    };
  }

  function removeRow(idx: number) {
    return () => {
      removeListItem('entries', idx);
    };
  }

  async function handleModalConfirm(data: Transaction) {
    setModalOpen(false);
    setOverlay(true);
    const response = await callApi('/api/journal', {
      body: JSON.stringify(data),
      method: 'POST'
    });
    setOverlay(false);
    if (response.ok) {
      showNotification({
        color: 'green',
        message: 'All is good.',
        title: 'Transaction saved'
      });
      reset();
      return;
    }
    showNotification({
      color: 'ed',
      message: 'Something went wrong, sorry.',
      title: 'Error'
    });
  }

  const outBalance = (values.entries as Posting[]).reduce((acc, e) => acc + Number(e.amount), 0);

  const amountPlaceholder = !isNaN(outBalance) && outBalance !== 0 ? (outBalance * -1).toString() : null;

  const date = new Date(values.date);
  const dateStr = isToday(date) ? 'Today' : date.toLocaleDateString();

  return (
    <>
      <form onSubmit={onSubmit(handleSubmit)} style={{ position: 'relative' }}>
        <LoadingOverlay visible={showOverlay} />
        <Text size="sm" style={{ marginTop: '15px' }}>
          Date:{' '}
          <Button onClick={() => setDateOpen(true)} size="xs" compact variant="outline">
            {dateStr}
          </Button>
        </Text>
        <Modal opened={dateOpen} onClose={() => setDateOpen(false)} withCloseButton={false}>
          <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
            <Calendar
              value={date}
              onChange={date => {
                date && setFieldValue('date', date);
                setDateOpen(false);
              }}
            />
          </div>
        </Modal>
        <AsyncAutocomplete
          label="Payee / Description"
          value={values.description}
          style={{ marginTop: '15px' }}
          onChange={value => setFieldValue('description', value)}
          endpoint="/api/s/description"
        />
        {values.entries.map((entry, i) => (
          <EntryRow
            description={values.description}
            canDelete={i !== 0}
            entry={entry}
            key={i}
            removeRow={removeRow(i)}
            updateRow={updateRow(i)}
            amountPlaceholder={amountPlaceholder}
            commodities={journal.commodities}
          />
        ))}
        <PaymentAccount
          description={values.description}
          value={values.payingAccount}
          onChange={value => setFieldValue('payingAccount', value)}
        />
        <Chip.Group style={{ marginTop: '25px' }} multiple value={options} onChange={setOptions}>
          <Chip value={OPTION_SPLITWISE} size="xs" radius="sm">
            Split with Splitwise
          </Chip>
        </Chip.Group>
        <Group position="right" style={{ marginTop: '25px' }}>
          <Button variant="outline" onClick={addRow}>
            Add row
          </Button>
          <Button color="blue" type="submit">
            Save
          </Button>
        </Group>
      </form>
      {modalOpen && (
        <ConfirmationModal
          data={prepareSubmitData(values, options)}
          onCancel={() => setModalOpen(false)}
          onConfirm={handleModalConfirm}
        />
      )}
    </>
  );
};

export default Dashboard;
