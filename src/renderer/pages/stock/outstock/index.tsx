import React, { PureComponent } from 'react';
import { BaseProps, ConnectState, TheDispatch } from '@/models/connect';
import { Tag, Button, Icon } from 'antd';
import moment from 'moment';
import { ColumnProps } from '@/components/DataTable/interface';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DataTable from '@/components/DataTable';
import OutstockDrawer from '../components/OutstockDrawer';

interface OutstockViewProps extends BaseProps {
  config?: ConnectState['settings']['systemSettings'];
  outstockList?: ConnectState['outstockList'];
}

interface OutstockViewState {
  addDrawerVisible: boolean;
  addDrawerMode: 'create' | 'update' | 'closed';
  currentStep: number;
}

@connect((s: ConnectState) => ({
  config: s.settings.systemSettings,
  outstockList: s.outstockList,
}))
class OutstockView extends PureComponent<OutstockViewProps, OutstockViewState> {
  state: OutstockViewState = {
    addDrawerVisible: false,
    addDrawerMode: 'create',
    currentStep: 1,
  };

  get tableColumns(): ColumnProps<any>[] {
    const { config = {} as ConnectState['settings']['systemSettings'] } = this.props;

    return [
      {
        title: '标题',
        dataIndex: 'title',
        width: 300,
      },
      {
        title: '进货日期',
        dataIndex: 'outStockTime',
        width: 150,
        render: (value: string) => {
          return <span>{moment(value).format('YYYY-MM-DD')}</span>;
        },
      },
      {
        title: '供货商',
        dataIndex: 'provider',
      },

      {
        title: '状态',
        dataIndex: 'currentStep',
        render: val => {
          if (+val === 2) {
            return <Tag color={config.colors.red}>验收中</Tag>;
          }

          const isFinished = +val >= 3;
          return (
            <Tag color={isFinished ? config.colors.primary : config.colors.green}>
              {isFinished ? '已完成' : '入库中'}
            </Tag>
          );
        },
      },
      {
        title: '验收员',
        dataIndex: 'checkerObj',
        render: (val: any) => {
          return <span>{val.realname}</span>;
        },
      },
      {
        title: '操作',
        dataIndex: 'action',
        align: 'left',
        // width: 100,
        render: (txt: string, record: any) => {
          // const { currentStep } = record;
          // let isFinished = false;
          // if (+currentStep >= 3) {
          //   isFinished = true;
          // }
          return (
            <div>
              <Button size="small" onClick={this.handleEditOrder(record)}>
                <Icon type="edit" />
              </Button>
              {/* <IconButton
                onClick={this.handleEditOrder(record)}
              >
                <Edit />
              </IconButton>
              <AlertDialogButton 
                title="是否要删除该入库订单?"
                component={IconButton}
                buttonProps={{
                  color: 'secondary',
                }}
                content="我们不推荐您进行该操作，如果您执意删除请点击下面的确认按钮"
                onOK={() => {}}
              >
                <Delete />
              </AlertDialogButton> */}
            </div>
          );
        },
      },
    ];
  }

  handleEditOrder = (record: any) => (e: React.MouseEvent) => {
    e.preventDefault();
    // console.log(record, 'record');
    const { dispatch = {} as TheDispatch } = this.props;

    this.setState({
      currentStep: record.currentStep,
    });

    dispatch({
      type: 'outstock/saveCurrentOrder',
      payload: record,
    });

    dispatch({
      type: 'outstock/loadOutStockOrderItems',
      payload: {
        orderID: record._id,
      },
    });

    this.toggleUpdateOne();
  };

  toggleUpdateOne = () => {
    this.setState({
      addDrawerVisible: true,
      addDrawerMode: 'update',
    });
  };

  handleAddDrawer = () => {
    const { dispatch = {} as TheDispatch } = this.props;

    dispatch({
      type: 'outstock/saveCurrentOrder',
      payload: {},
    });

    this.setState({
      currentStep: 0,
      addDrawerVisible: true,
      addDrawerMode: 'create',
    });
  };

  handleChangePage = (page: number, pageSize?: number) => {
    const { dispatch = {} as TheDispatch } = this.props;

    dispatch({
      type: 'outstockList/loadList',
      payload: {
        page: page,
        pageSize: pageSize,
      },
    });
  };

  handleAddDrawerClose = (e: any) => {
    // e.preventDefault();

    const { dispatch = {} as TheDispatch } = this.props;

    // load list
    dispatch({
      type: 'outstockList/loadList',
    });

    dispatch({
      type: 'outstock/clearCurrentOrderInfo',
    });

    this.setState({
      addDrawerVisible: false,
      addDrawerMode: 'closed',
      currentStep: -1,
    });
  };

  handleDoNext = () => {
    const { dispatch = {} as TheDispatch } = this.props;

    // load list
    dispatch({
      type: 'outstockList/loadList',
    });

    dispatch({
      type: 'outstock/clearCurrentOrderInfo',
    });

    this.setState({
      addDrawerVisible: false,
      addDrawerMode: 'closed',
      currentStep: -1,
    });
  };

  componentDidMount() {
    const { dispatch = {} as TheDispatch } = this.props;

    dispatch({
      type: 'outstockList/loadList',
    });
  }

  render() {
    const { outstockList = {} as ConnectState['outstockList'] } = this.props;
    const { listDetails } = outstockList;
    const { pagination = {} } = listDetails;

    return (
      <PageHeaderWrapper title="出库管理" content="从出货单开始出库新到的货品">
        <DataTable
          columns={this.tableColumns}
          rows={listDetails.list}
          fixedColumnsRight={['action']}
          showSearch
          paginationConfig={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            onPageChange: this.handleChangePage,
            total: pagination.total,
          }}
          actions={
            <Button type="primary" onClick={this.handleAddDrawer}>
              添加
            </Button>
          }
        />

        <OutstockDrawer
          visible={this.state.addDrawerVisible}
          onClose={this.handleAddDrawerClose}
          doNext={this.handleDoNext}
          current={this.state.currentStep}
          mode={this.state.addDrawerMode}
        />
      </PageHeaderWrapper>
    );
  }
}

export default OutstockView;
