import React, { FC } from 'react';

import { createStyles, Loader as MLoader } from '@mantine/core';

const useStyles = createStyles(() => {
  return {
    wrapper: { textAlign: "center", margin: "1em 0" },
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
