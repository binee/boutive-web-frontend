import React from 'react';
import {FaHome, FaInfo} from 'react-icons/fa';

export const MainMenuSidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <FaHome className="User-icon-color"/>,
    cName: 'User-nav-text'
  },
  {
    title: 'About',
    path: '/about',
    icon: <FaInfo className="User-icon-color"/>,
    cName: 'User-nav-text'
  },

];
