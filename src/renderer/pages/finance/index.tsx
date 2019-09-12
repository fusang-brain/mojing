import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Empty, Button } from 'antd';
import Details from './components/Details';
import MapsView from './components/MapsView';
import { TheDispatch, BaseProps, ConnectState } from '@/models/connect';
import moment from 'moment';
import { connect } from 'dva';

interface FinanceProps extends BaseProps {}

interface FinanceState {
  activeKey?: string;
}

@connect((s: ConnectState) => ({}))
class FinanceView extends PureComponent<FinanceProps, FinanceState> {
  state: FinanceState = {
    activeKey: 'details',
  };

  handleTabChange = (activeKey: string) => {
    this.setState({
      activeKey,
    });
  };

  renderTabPanel = () => {
    const { activeKey } = this.state;

    if (activeKey === 'details') {
      return <Details />;
    }

    if (activeKey === 'maps') {
      return <MapsView />;
    }

    return <Empty />;
  };

  componentDidMount() {
    const { dispatch = {} as TheDispatch } = this.props;
    dispatch({
      type: 'finance/loadList',
      payload: {
        date: moment().toISOString(),
      },
    });
  }

  render() {
    return (
      <PageHeaderWrapper
        tabList={[
          {
            key: 'details',
            tab: '明细',
          },
          {
            key: 'maps',
            tab: '图表',
          },
        ]}
        tabActiveKey={this.state.activeKey}
        onTabChange={this.handleTabChange}
        tabBarExtraContent={<Button type="primary">记账</Button>}
        content="记录您的店内或者个人支出和收入"
        title="店内账簿"
      >
        {this.renderTabPanel()}
      </PageHeaderWrapper>
    );
  }
}

export default FinanceView;
