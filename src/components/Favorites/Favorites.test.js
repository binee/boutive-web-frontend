import React from 'react';
import ReactDOM from 'react-dom';
import Favorites from './Favorites';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Favorites />, div);
  ReactDOM.unmountComponentAtNode(div);
});