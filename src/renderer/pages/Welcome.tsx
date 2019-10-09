import React from 'react';
import { Card, Typography, Icon } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { FormattedMessage } from 'umi-plugin-react/locale';
// import { HomeIcon } from '@/components/SvgIcons';

const CodePreview: React.FC<{}> = ({ children }) => (
  <pre
    style={{
      // background: '#f2f4f5',
      padding: '12px 20px',
      margin: '12px 0',
    }}
  >
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default (): React.ReactNode => (
  <PageHeaderWrapper>
    <Card 
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography.Title>
        欢迎来到魔镜店+
      </Typography.Title>
    </Card>
  </PageHeaderWrapper>
);
