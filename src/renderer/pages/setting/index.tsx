import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import { Menu, Icon } from 'antd';
import EnterpriseConfig from './components/EnterpriseConfig';
import AccessConfig from './components/AccessConfig';
import EmployeeManager from './components/EmployeeManager';

interface ListItemType {
  Icon?: React.ReactNode;
  label?: string;
  id?: string;
}

interface SettingViewProps {}

interface SettingViewState {
  currentActive?: string;
}

class SettingView extends PureComponent<SettingViewProps, SettingViewState> {
  state: SettingViewState = {
    currentActive: 'enterpriseConfig',
  };

  get ListItems(): Array<ListItemType> {
    return [
      {
        Icon: <Icon type="shop" />,
        label: '企业设置',
        id: 'enterpriseConfig',
      },
      {
        Icon: <Icon type="team" />,
        label: '成员管理',
        id: 'membersManger',
      },
      {
        Icon: <Icon type="safety" />,
        label: '权限管理',
        id: 'accessManager',
      },
      {
        Icon: <Icon type="tool" />,
        label: '售后支持',
        id: 'afterSaleSupport',
      },
    ];
  }

  render() {
    return (
      <PageHeaderWrapper>
        <div className={styles.bodyInner}>
          <div className={styles.menu}>
            <Menu
              style={{
                width: '100%',
              }}
              selectedKeys={[this.state.currentActive || 'enterpriseConfig']}
              onClick={param => {
                this.setState({
                  currentActive: param.key,
                });
              }}
            >
              {this.ListItems.map(item => (
                <Menu.Item key={item.id}>
                  {item.Icon}
                  {item.label}
                </Menu.Item>
              ))}
            </Menu>
          </div>
          <div className={styles.content}>
            {this.state.currentActive === 'enterpriseConfig' && <EnterpriseConfig />}

            {this.state.currentActive === 'membersManger' && <EmployeeManager />}

            {this.state.currentActive === 'accessManager' && <AccessConfig />}
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default SettingView;
