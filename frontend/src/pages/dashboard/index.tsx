import React, { FC, useState } from 'react';

import { callApi } from 'helpers/api';

import { Button, Group, LoadingOverlay, Paper, TextInput, Title } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';

import { Transaction, TransactionEntry } from 'pta-journal';
import { Api } from 'types';

import ConfirmationModal from './confirmation-modal';
import EntryRow from './entry-row';
import PaymentAccount from './payment-acct-row';

const EMPTY_ENTRY: TransactionEntry = {
  account: "",
  amount: "",
};

function allValuesAreEqual<T>(values: T[]): T | undefined {
  if (values.every((value) => value == null || value === values[0])) {
    return values[0];
  }
}

type FormData = Transaction & {
  payingAccount?: string;
};

function prepareSubmitData(data: FormData): Transaction {
  const { payingAccount, ...trx } = data;
  if (payingAccount) {
    trx.entries.push({ account: payingAccount });
  }
  return trx;
}
const Dashboard: FC<{ journal: Api.BootstrapResponse }> = ({ journal }) => {
  const notifications = useNotifications();

  const { onSubmit, values, setFieldValue, setValues, reset } =
    useForm<FormData>({
      initialValues: {
        date: new Date(),
        description: "",
        entries: [EMPTY_ENTRY],
      },
    });

  const [modalOpen, setModalOpen] = useState(false);
  const [showOverlay, setOverlay] = useState(false);

  const handleSubmit = () => {
    setModalOpen(true);
  };

  function addRow() {
    setValues((state) => ({
      ...state,
      entries: state.entries.concat({ ...EMPTY_ENTRY }),
    }));
  }

  function updateRow(idx: number) {
    return (field: string, value: string) => {
      setValues((state) => ({
        ...state,
        entries: state.entries.map((e, i) => {
          if (i !== idx) {
            return e;
          }

          return { ...e, [field]: value };
        }),
      }));
    };
  }

  function removeRow(idx: number) {
    return () => {
      setValues((state) => ({
        ...state,
        entries: state.entries.filter((e, i) => i !== idx),
      }));
    };
  }

  async function handleModalConfirm(data: Transaction) {
    setModalOpen(false);
    setOverlay(true);
    const response = await callApi("/api/journal", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setOverlay(false);
    if (response.ok) {
      notifications.showNotification({
        title: "Transaction saved",
        message: "All is good.",
        color: "green",
      });
      reset();
      return;
    }
    notifications.showNotification({
      title: "Error",
      message: "Something went wrong, sorry.",
      color: "ed",
    });
  }

  const outBalance = values.entries.reduce(
    (acc, e) => acc + Number(e.amount),
    0
  );

  const amountPlaceholder =
    !isNaN(outBalance) && outBalance !== 0
      ? (outBalance * -1).toString()
      : null;

  const singleCommodity = allValuesAreEqual(
    values.entries.map((e) => e.commodity)
  );

  return (
    <div>
      <Paper padding="md" shadow="sm" component="section">
        <form
          onSubmit={onSubmit(handleSubmit)}
          style={{ position: "relative" }}
        >
          <LoadingOverlay visible={showOverlay} />
          <Title order={2}>Add</Title>
          <DatePicker
            style={{ marginTop: "15px" }}
            placeholder="Pick a date"
            label="Date"
            value={values.date}
            onChange={(date) => date && setFieldValue("date", date)}
          />
          <TextInput
            style={{ marginTop: "15px" }}
            label="Payee / Description"
            value={values.description}
            onChange={(event) =>
              setFieldValue("description", event.currentTarget.value)
            }
          />
          {values.entries.map((entry, i) => (
            <EntryRow
              accounts={journal.accounts}
              canDelete={i !== 0}
              commodities={journal.commodities}
              entry={entry}
              key={i}
              removeRow={removeRow(i)}
              updateRow={updateRow(i)}
              amountPlaceholder={amountPlaceholder}
              suggestedCommodity={singleCommodity}
            />
          ))}
          <PaymentAccount
            accounts={journal.accounts}
            value={values.payingAccount}
            onChange={(value) => setFieldValue("payingAccount", value)}
          />
          <Group position="right" style={{ marginTop: "25px" }}>
            <Button variant="outline" onClick={addRow}>
              Add row
            </Button>
            <Button color="blue" type="submit">
              Save
            </Button>
          </Group>
        </form>
      </Paper>
      {modalOpen && (
        <ConfirmationModal
          data={prepareSubmitData(values)}
          onCancel={() => setModalOpen(false)}
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  );
};

export default Dashboard;
