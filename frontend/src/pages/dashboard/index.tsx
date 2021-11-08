import React, { FC, useState } from 'react';

import { callApi } from 'helpers/api';

import { Button, Group, LoadingOverlay, Paper, TextInput, Title } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';

import { Transaction } from 'pta-journal';
import { Api } from 'types';

import ConfirmationModal from './confirmation-modal';
import EntryRow from './entry-row';

const EMPTY_ENTRY = { account: "", amount: "", commodity: "" };

const Dashboard: FC<{ journal: Api.BootstrapResponse }> = ({ journal }) => {
  const notifications = useNotifications();

  const { onSubmit, values, setFieldValue, setValues, reset } = useForm({
    initialValues: {
      date: new Date(),
      description: "",
      entries: [EMPTY_ENTRY, EMPTY_ENTRY],
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
            label="Description"
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
            />
          ))}
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
          data={values}
          onCancel={() => setModalOpen(false)}
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  );
};

export default Dashboard;
