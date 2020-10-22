import React from 'react';
import { Content } from '../content';
import { data } from '../mock';
import { SideBar } from '../sideBar';
import './style.scss';

export const RootApp = () => {
  return (
    <div className="root-app">
      <SideBar operations={data} />
      <Content operation={data[0]}/>
    </div>
  );
}

