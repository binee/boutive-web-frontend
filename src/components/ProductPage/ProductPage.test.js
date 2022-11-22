import React from 'react';
import ReactDOM from 'react-dom';
import ProductPage from './ProductPage';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ProductPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});