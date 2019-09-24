import React from 'react';
import { Spin } from 'antd';
import MJIcon from '../MJIcon';

// loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport
const antIcon = <MJIcon type="icon-Loading" spin />;

const PageLoading: React.FC = () => (
  <div style={{ paddingTop: 100, textAlign: 'center' }}>
    <Spin size="large" indicator={antIcon} />
  </div>
);
export default PageLoading;
