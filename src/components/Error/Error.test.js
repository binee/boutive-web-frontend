import React from 'react';
import ReactDOM from 'react-dom';
import Error from './Error';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Error />, div);
  ReactDOM.unmountComponentAtNode(div);
});