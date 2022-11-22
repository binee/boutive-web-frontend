import React from 'react';
import ReactDOM from 'react-dom';
import Following from './Following';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Following />, div);
  ReactDOM.unmountComponentAtNode(div);
});