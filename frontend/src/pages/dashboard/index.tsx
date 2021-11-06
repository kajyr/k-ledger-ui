import React, { FC, useState } from 'react';

import { callApi } from 'helpers/api';
import clearTransaction from 'helpers/clear-transaction';

import { Autocomplete, Button, Group, LoadingOverlay, Paper, TextInput, Title } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';

import { Transaction } from 'pta-journal';
import { Api } from 'types';

import ConfirmationModal from './confirmation-modal';

const EMPTY_ENTRY = { account: "", amount: "", commodity: "" };

const Dashboard: FC<{ journal: Api.BootstrapResponse }> = ({ journal }) => {
  const notifications = useNotifications();

  const { onSubmit, values, setFieldValue, setValues, reset } = useForm({
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

  function updateRow(idx: number, field: string, value: string) {
    setValues((state) => ({
      ...state,
      entries: state.entries.map((e, i) => {
        if (i !== idx) {
          return e;
        }

        return { ...e, [field]: value };
      }),
    }));
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
            placeholder="Pick a date"
            label="Date"
            value={values.date}
            onChange={(date) => date && setFieldValue("date", date)}
          />
          <TextInput
            label="Description"
            value={values.description}
            onChange={(event) =>
              setFieldValue("description", event.currentTarget.value)
            }
          />
          {values.entries.map((entry, i) => (
            <Group style={{ marginTop: 25, alignItems: "center" }} key={i}>
              <Autocomplete
                placeholder="Account"
                value={entry.account}
                style={{ flex: 2 }}
                data={journal.accounts}
                filter={(value, item) =>
                  item.value.toLowerCase().includes(value.toLowerCase().trim())
                }
                onChange={(value) => updateRow(i, "account", value)}
              />
              <TextInput
                placeholder="Amount"
                value={entry.amount}
                style={{ flex: 1 }}
                onChange={(event) =>
                  updateRow(i, "amount", event.currentTarget.value)
                }
              />
              <Autocomplete
                placeholder="Commodity"
                value={entry.commodity}
                style={{ flex: 1 }}
                onChange={(value) => updateRow(i, "commodity", value)}
                data={journal.commodities}
                filter={(value, item) =>
                  item.value.toLowerCase().includes(value.toLowerCase().trim())
                }
              />
              <Button compact onClick={addRow} size="md">
                +
              </Button>
              <Button
                disabled={i === 0}
                compact
                onClick={removeRow(i)}
                size="md"
              >
                -
              </Button>
            </Group>
          ))}
          <Group position="right" style={{ marginTop: 25 }}>
            <Button color="blue" type="submit">
              Add
            </Button>
          </Group>
        </form>
      </Paper>
      {modalOpen && (
        <ConfirmationModal
          data={values}
          onCancel={() => setModalOpen(false)}
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  );
};

export default Dashboard;
