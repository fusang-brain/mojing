import React from 'react';
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Card, Typography } from 'antd';

export default (): React.ReactNode => (
  <PageHeaderWrapper>
    <Card>
      <Typography.Text strong>
        查询
      </Typography.Text>
    </Card>
  </PageHeaderWrapper>
);