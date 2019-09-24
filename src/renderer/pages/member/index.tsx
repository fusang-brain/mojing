import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { BaseProps } from '@/models/connect';
import CustomerView from './components/CustomerView';

interface IMemberViewProps extends BaseProps {}

interface IMemberViewState {
  defaultTabActiveKey?: string;
  tabActiveKey?: string;
}

class MemberView extends PureComponent<IMemberViewProps, IMemberViewState> {
  state: IMemberViewState = {
    defaultTabActiveKey: 'customer',
    tabActiveKey: 'customer',
  };

  get tabList() {
    return [
      {
        key: 'customer',
        tab: '零售客户',
      },
      {
        key: 'supplier',
        tab: '供应商',
      },
    ];
  }

  handleTabChange = (key: string) => {
    this.setState({
      tabActiveKey: key,
    });
  };

  render() {
    return (
      <PageHeaderWrapper
        title="客户管理"
        tabList={this.tabList}
        tabActiveKey={this.state.tabActiveKey}
        onTabChange={this.handleTabChange}
      >
        {this.state.tabActiveKey === 'customer' ? <CustomerView /> : null}

        {this.state.tabActiveKey === 'supplier' ? <></> : null}
      </PageHeaderWrapper>
    );
  }
}

export default MemberView;
