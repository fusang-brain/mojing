import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Empty, Button, Modal, Tabs, message } from 'antd';
import Details from './components/Details';
import MapsView from './components/MapsView';
import { TheDispatch, BaseProps, ConnectState, Loading } from '@/models/connect';
import moment from 'moment';
import { connect } from 'dva';
import NoteBooksForm from './components/NoteBooksForm';

interface FinanceProps extends BaseProps {}

interface FinanceState {
  activeKey?: string;
  formVisible?: boolean;
}

@connect((s: ConnectState) => ({
  loading: s.loading,
}))
class FinanceView extends PureComponent<FinanceProps, FinanceState> {
  state: FinanceState = {
    activeKey: 'details',
    formVisible: false,
  };

  handleTabChange = (activeKey: string) => {
    this.setState({
      activeKey,
    });
  };

  handleSaveFinance = (values: any, beNext: boolean = false) => {
    const { dispatch } = this.props;

    if (!dispatch) {
      message.error('组件渲染错误');
      return Promise.reject('error');
    }

    return dispatch({
      type: 'finance/create',
      payload: values,
    }).then(() => {
      if (!beNext) {
        this.chargeBooksClose();
      }

      return true;
    });
  };

  chargeBooksClose = () => {
    this.setState({
      formVisible: false,
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

    dispatch({
      type: 'finance/loadStatistic',
      payload: {
        date: moment().toISOString(),
      },
    });
  }

  render() {
    const { loading = {} as Loading } = this.props;

    return (
      <>
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
          tabBarExtraContent={
            <Button
              type="primary"
              onClick={() => {
                this.setState({ formVisible: true });
              }}
            >
              记账
            </Button>
          }
          content="记录您的店内或者个人支出和收入"
          title="店内账簿"
        >
          {this.renderTabPanel()}
        </PageHeaderWrapper>
        <Modal
          title={`记账`}
          centered
          visible={this.state.formVisible}
          onCancel={() => {
            this.setState({
              formVisible: false,
            });
          }}
          footer={false}
        >
          <Tabs tabPosition="top">
            <Tabs.TabPane tab="支出" key="out">
              <NoteBooksForm
                type="out"
                loading={loading.effects['finance/create']}
                onSave={this.handleSaveFinance}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="收入" key="income">
              <NoteBooksForm
                type="income"
                loading={loading.effects['finance/create']}
                onSave={this.handleSaveFinance}
              />
            </Tabs.TabPane>
          </Tabs>
        </Modal>
      </>
    );
  }
}

export default FinanceView;
