import React from 'react';
import { useHistory } from 'react-router';
import ThreadForm from '../component/ThreadForm';

const CreateThread_new = () => {
  const history = useHistory();

  const temp = {
    "margin": "10px",
  };

  return(
    <div>
      <div style={ temp }>
        <button onClick={ history.goBack }>Go back</button>
        <h1>Create Thread</h1>
        <ThreadForm />
      </div>
    </div>
  );
};

export default CreateThread_new;