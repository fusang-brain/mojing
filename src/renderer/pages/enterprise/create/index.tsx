import React, { Component } from 'react';
import { Drawer } from 'antd';
// import styles from './styles.less';

// import { PageHeaderWrapper } from "@ant-design/pro-layout";
// import { Card, Typography } from 'antd';

class CreateEnterprise extends Component {

  render() {
    return (
      <>
        <Drawer
          title="创建店铺"
          placement="left"
          closable={false}
          visible={true}
          width="100%"
          height="100%"
          keyboard={false}
        >

        </Drawer>
      </>
    );
  }
}

export default CreateEnterprise;