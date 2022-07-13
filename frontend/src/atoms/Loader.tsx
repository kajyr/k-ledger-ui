import React, { FC } from 'react';

import { Loader as MLoader, createStyles } from '@mantine/core';

const useStyles = createStyles(() => {
  return {
    wrapper: { margin: '1em 0', textAlign: 'center' }
  };
});

const Loader: FC = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      <MLoader />
    </div>
  );
};

export default Loader;
