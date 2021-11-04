import React, { FC } from 'react';
import { Link } from 'react-router-dom';

const FourOhFour: FC = () => {
  return (
    <div>
      <p>Sorry, there is nothing here</p>
      <Link to="/">Go home</Link>
    </div>
  );
};

export default FourOhFour;
