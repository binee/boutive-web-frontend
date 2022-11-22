import React from 'react';
import ReactDOM from 'react-dom';
import Boutique from './Boutique';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Boutique />, div);
  ReactDOM.unmountComponentAtNode(div);
});