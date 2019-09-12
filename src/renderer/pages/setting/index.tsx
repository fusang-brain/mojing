import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Typography } from 'antd';

export default (): React.ReactNode => (
  <PageHeaderWrapper>
    <Card>
      <Typography.Text strong>创建企业</Typography.Text>
    </Card>
  </PageHeaderWrapper>
);
