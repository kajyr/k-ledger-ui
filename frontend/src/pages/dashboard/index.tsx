import { callApi } from 'helpers/api';
import { isToday } from 'helpers/dates';
import { Posting, Transaction } from 'pta-tools';
import { Api } from 'types';

import React, { FC, useState } from 'react';

import AsyncAutocomplete from 'atoms/async-autocomplete';

import { Button, Chip, Chips, Group, LoadingOverlay, Popover, Text } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { useForm } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';

import ConfirmationModal from './confirmation-modal';
import EntryRow from './entry-row';
import PaymentAccount from './payment-acct-row';
import prepareSubmitData from './prepare-submit';

const EMPTY_ENTRY: Posting = {
  account: '',
  amount: ''
};

export const OPTION_SPLITWISE = 'splitwise';

export type FormData = Transaction & {
  payingAccount?: string;
};

const Dashboard: FC<{ journal: Api.BootstrapResponse }> = () => {
  const notifications = useNotifications();
  const [options, setOptions] = useState<string[]>([]);

  const { onSubmit, values, setFieldValue, setValues, reset } = useForm<FormData>({
    initialValues: {
      date: new Date(),
      description: '',
      entries: [EMPTY_ENTRY]
    }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [showOverlay, setOverlay] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const handleSubmit = () => {
    setModalOpen(true);
  };

  function addRow() {
    setValues(state => ({
      ...state,
      entries: state.entries.concat({ ...EMPTY_ENTRY })
    }));
  }

  function updateRow(idx: number) {
    return (field: string, value: string) => {
      setValues(state => ({
        ...state,
        entries: state.entries.map((e, i) => {
          if (i !== idx) {
            return e;
          }

          return { ...e, [field]: value };
        })
      }));
    };
  }

  function removeRow(idx: number) {
    return () => {
      setValues(state => ({
        ...state,
        entries: state.entries.filter((e, i) => i !== idx)
      }));
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
      notifications.showNotification({
        color: 'green',
        message: 'All is good.',
        title: 'Transaction saved'
      });
      reset();
      return;
    }
    notifications.showNotification({
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
        <Popover
          opened={dateOpen}
          onClose={() => setDateOpen(false)}
          target={
            <Text size="sm" style={{ marginTop: '15px' }}>
              Date:{' '}
              <Button onClick={() => setDateOpen(o => !o)} size="xs" compact variant="outline">
                {dateStr}
              </Button>
            </Text>
          }
          styles={{ body: { width: 260 } }}
          withArrow>
          <div style={{ display: 'flex' }}>
            <Calendar
              value={date}
              onChange={date => {
                date && setFieldValue('date', date);
                setDateOpen(false);
              }}
            />
          </div>
        </Popover>
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
          />
        ))}
        <PaymentAccount
          description={values.description}
          value={values.payingAccount}
          onChange={value => setFieldValue('payingAccount', value)}
        />
        <Chips style={{ marginTop: '25px' }} size="xs" radius="sm" multiple value={options} onChange={setOptions}>
          <Chip value={OPTION_SPLITWISE}>Split with Splitwise</Chip>
        </Chips>
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
