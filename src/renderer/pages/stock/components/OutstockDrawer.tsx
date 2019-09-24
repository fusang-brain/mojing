import React, { PureComponent } from 'react';
import { Drawer, Typography, Steps, message, Result, Button } from 'antd';
import { BaseProps, ConnectState, TheDispatch } from '@/models/connect';
import styles from './styles.less';
import { connect } from 'dva';
import { DrawerProps } from 'antd/lib/drawer';
import OrderPane from './form/OrderPane';
import UpgradeItemsPane from './form/UpgradeItemsPane';
import CheckItemsTable from './form/CheckItemsTable';
import { router } from 'umi';

interface OutstockDrawerProps extends BaseProps {
  outstock?: ConnectState['outstock'];
  current?: number;
  visible?: boolean;
  mode?: 'create' | 'update' | 'closed';
  onClose?: DrawerProps['onClose'];
  doNext?: () => void;
}

interface OutstockDrawerState {
  lastCurrent?: number;
  current?: number;
  selectedBatchInfo?: { [key: string]: any };
  mode: 'create' | 'update' | 'closed';
  lastProps: { [key: string]: any };
  saveItemsLoading: boolean;
}

@connect((s: ConnectState) => ({
  outstock: s.outstock,
}))
class OutstockDrawer extends PureComponent<OutstockDrawerProps, OutstockDrawerState> {
  state: OutstockDrawerState = {
    lastCurrent: 0,
    current: 0,
    selectedBatchInfo: {} as { [key: string]: any },
    mode: 'create',
    lastProps: {},
    saveItemsLoading: false,
  };

  static getDerivedStateFromProps(prop: OutstockDrawerProps, prevState: OutstockDrawerState) {
    const { current = 0, mode } = prop;
    const { lastProps = {} } = prevState;
    let updateState = false;

    const state = {
      ...prevState,
    };

    if (lastProps.current !== current) {
      state.current = current;
      updateState = true;
    }

    if (lastProps.mode !== mode) {
      state.mode = mode || 'closed';
      updateState = true;
    }

    if (updateState) {
      return {
        ...state,
        lastProps: prop,
      };
    }
    return null;
  }

  get steps() {
    const steps: {
      id?: string;
      title?: string;
      content?: React.ReactNode;
      status?: 'wait' | 'process' | 'finish' | 'error';
    }[] = [
      {
        id: 'start',
        title: '出库开单',
        status: 'process',
        content: this.renderInStockPane(),
      },
      {
        id: 'addItems',
        title: '出库项的添加与修改',
        status: 'wait',
        content: this.renderAddItemsPane(),
      },
      {
        id: 'checkItem',
        title: '出库单验收',
        status: 'wait',
        content: this.renderCheckPane(),
      },
      {
        id: 'finished',
        title: '完成',
        status: 'wait',
        content: this.renderFinishedPane(),
      },
    ];

    return steps;
  }

  /**
   * 下一步
   */
  next = () => {
    let { current = 0 } = this.state;

    current = current + 1;
    if (current > this.steps.length) {
      current = this.steps.length;
    }
    this.setState({
      current,
    });
  };

  /**
   * 上一步
   */
  prev = () => {
    let { current = 0 } = this.state;
    current = current - 1;
    this.setState({
      current: current || 0,
    });
  };

  /**
   * 保存入库单
   */
  handleSaveStockOrder = (vals: any) => {
    const values = {
      ...vals,
      outStockTime: vals.outStockTime.format('YYYY-MM-DD HH:mm:ss'),
    };

    const { dispatch = {} as TheDispatch } = this.props;

    const { mode } = this.state;

    if (mode === 'create') {
      // create order
      return dispatch({
        type: 'outstock/createOutStockOrder',
        payload: values,
      }).then(() => {
        this.next();
      });
    } else if (mode === 'update') {
      // update order
      return dispatch({
        type: 'outstock/updateOutStockOrder',
        payload: values,
      }).then(() => {
        this.next();
      });
    } else {
      message.error('当前模式错误, 请刷新重试!');
    }

    return Promise.resolve(null);
  };

  /**
   * 保存入库项
   */
  handleSaveItems = (currentItems: any) => {
    const { dispatch = {} as TheDispatch, outstock = {} as ConnectState['outstock'] } = this.props;
    const { currentOrder } = outstock;

    this.setState({
      saveItemsLoading: true,
    });

    dispatch({
      type: 'outstock/updateOrderState',
    })
      .then(() => {
        return dispatch({
          type: 'outstock/loadOutStockOrderItems',
          payload: {
            orderID: currentOrder._id,
          },
        });
      })
      .then(() => {
        this.setState({
          saveItemsLoading: false,
        });
        this.next();
      })
      .catch(e => {
        message.error('入库时项添加时出现错误，请联系管理员！');
      });
  };

  // Step 1
  renderInStockPane = () => {
    // return <OrderPane
    //   orderModel={this.props.outstock}
    //   kind="outstock"
    //   onSave={this.handleSaveStockOrder}
    // />

    return (
      <OrderPane
        orderModel={this.props.outstock}
        kind="outstock"
        onSave={this.handleSaveStockOrder}
      />
    );
  };

  // Step 2
  renderAddItemsPane = () => {
    const { outstock = {} as ConnectState['outstock'] } = this.props;

    const { currentOrder = {} } = outstock;

    // return <UpgradeItemsPane
    //   kind="outstock"
    //   submiting={this.state.saveItemsLoading}
    //   nextStep={(items) => {
    //     if (+currentOrder.currentStep > 1) {
    //       this.next();
    //       return;
    //     }
    //     this.handleSaveItems(items);
    //   }}
    //   prevStep={() => this.prev()}
    // />

    return (
      <UpgradeItemsPane
        kind="outstock"
        nextStep={items => {
          if (+currentOrder.currentStep > 1) {
            this.next();
            return;
          }
          this.handleSaveItems(items);
        }}
        prevStep={() => this.prev()}
      />
    );
  };

  // Step 3
  renderCheckPane = () => {
    console.log('check');
    return (
      <CheckItemsTable kind="outstock" prevStep={() => this.prev()} nextStep={this.handleInstock} />
    );
  };

  renderFinishedPane = () => {
    const actions = (
      <div>
        <Button style={{ marginRight: '12px' }} type="primary" onClick={this.handleInstockNext}>
          关闭
        </Button>
        <Button onClick={() => router.push('/stock/query')}>查询库存</Button>
      </div>
    );

    return <Result title="入库成功" status="success" extra={actions} />;
  };

  handleInstockNext = () => {
    const { doNext } = this.props;
    if (doNext) {
      doNext();
    }
  };

  handleInstock = () => {
    const { dispatch = {} as TheDispatch, outstock = {} as ConnectState['outstock'] } = this.props;
    const { currentOrder } = outstock;

    dispatch({
      type: 'outstock/outstock',
      payload: {
        orderID: currentOrder._id,
      },
    }).then(val => {
      if (val) {
        this.next();
      }
    });
  };

  render() {
    const { current = 0 } = this.state;
    return (
      <Drawer
        className="mj-drawer"
        visible={this.props.visible}
        onClose={this.props.onClose}
        placement="right"
        width={'100%'}
        title={<Typography.Text>开始出库商品</Typography.Text>}
      >
        <div className={styles.stepWrapper}>
          <div className={styles.steps}>
            <Steps current={this.state.current}>
              {this.steps.map(step => (
                <Steps.Step key={step.id} title={step.title} />
              ))}
            </Steps>
          </div>

          <div className={styles.stepContent}>
            {current >= 0 ? this.steps[current].content : null}
          </div>
        </div>
      </Drawer>
    );
  }
}

export default OutstockDrawer;
