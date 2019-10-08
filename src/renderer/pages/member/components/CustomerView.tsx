import React, { PureComponent } from 'react';
import DataTable from '@/components/DataTable';
import { ColumnProps } from '@/components/DataTable/interface';
import { genGenderString } from '@/utils/helper';
import { ConnectState, TheDispatch, BaseProps } from '@/models/connect';
import { connect } from 'dva';
import { Icon, Button, Modal } from 'antd';
import EditCustomer from './EditCustomer';

interface ICustomerViewProps extends BaseProps {
  customers?: ConnectState['customers'];
}

interface ICustomerViewState {
  editModalVisible?: boolean;
  editModalMode?: 'create' | 'update' | 'view';
  currentRecord?: any;
  previewVisible?: boolean;
  customer?: string;
  delModelVisible?:boolean;
  confirmLoading?:boolean;
  delId?:string;
}

@connect((s: ConnectState) => ({
  customers: s.customers,
  loading: s.loading,
}))
class CustomerView extends PureComponent<ICustomerViewProps, ICustomerViewState> {
  state: ICustomerViewState = {
    editModalMode: 'create',
    editModalVisible: false,
    currentRecord: {},
    previewVisible: false,
    customer: '',
    delModelVisible:false,
    confirmLoading:false,
    delId:'',
  };

  get columnsConfig(): ColumnProps<any>[] {
    return [
      {
        title: '客户全名',
        dataIndex: 'name',
        align: 'left',
        width: 120,
      },
      {
        title: '性别',
        dataIndex: 'gender',
        render: (val: string) => {
          return <span>{genGenderString(val)}</span>;
        },
      },
      {
        title: '联系电话',
        dataIndex: 'mobile',
        width: 120,
      },
      {
        title: '上次购物日期',
        dataIndex: 'lastShopDate',
      },
      {
        title: '职业',
        dataIndex: 'job',
      },
      {
        title: '上次验光日期',
        dataIndex: 'lastOptometryDate',
        width: 160,
      },
      {
        title: '通信地址',
        dataIndex: 'contactAddress',
      },
      {
        title: '上次消费金额',
        dataIndex: 'lastConsumptionAmount',
      },
      {
        title: '消费总额',
        dataIndex: 'consumptionTotalAmount',
      },
      {
        title: '消费次数',
        dataIndex: 'consumptionCount',
      },
      {
        title: '客户积分',
        dataIndex: 'integral',
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 100,
        align: 'left',
        render: (txt: string, record: any) => {
          return (
            <>
              <Button size={'small'} onClick={this.handleViewOne(record)}>
                <Icon type="eye" />
              </Button>
              <Button size={'small'} type="danger" onClick={this.handleDeleteOne(record)}>
                <Icon type="delete" />
              </Button>
            </>
          );
        },
      },
    ];
  }

  handleViewOne = (record: any) => () => {
    const { dispatch = {} as TheDispatch } = this.props;
    dispatch({
      type: 'customers/findCustomerProfile',
      payload: {
        id: record._id,
      },
    });

    this.setState({
      editModalMode: 'view',
      editModalVisible: true,
      customer: record._id,
    });
  };

  handleDeleteOne = (record: any) => () => {
    this.setState({
      delModelVisible:true,
      delId:record._id,
    })
    // const { dispatch = {} as TheDispatch } = this.props;
    // Modal.confirm({
    //   title: '是否要删除该零售客户？',
    //   content: '本次删除操作将是不可逆的，删除后的信息将无法恢复，请确认您是否要进行本次删除。',
    //   okText: '删除',
    //   cancelText: '取消',
    //   onOk: () => {
    //     Modal.destroyAll();
    //     dispatch({
    //       type: 'customers/deleteCustomer',
    //       payload: record._id,
    //     });
    //   },
    // });
  };

  handleOk = () =>{
    this.setState({
      confirmLoading: true,
    });
    const { dispatch ={} as TheDispatch } = this.props;
    const { delId } = this.state;
    dispatch({
      type: 'customers/deleteCustomer',
      payload: delId,
    }).then(()=>{
      this.setState({
        delModelVisible:false,
        confirmLoading:false,
      })
    });
  }

  handleCancel = () =>{
    this.setState({
      delModelVisible:false,
    })
  }


  handleSearch = (value: any) => {
    const {
      dispatch = {} as TheDispatch,
      customers = {} as ConnectState['customers'],
    } = this.props;

    dispatch({
      type: 'customers/loadList',
      payload: {
        ...customers.queries,
        search: value,
      },
    });
  };

  handlePageChange = (page: number, pageSize?: number) => {
    const {
      dispatch = {} as TheDispatch,
      customers = {} as ConnectState['customers'],
    } = this.props;
    dispatch({
      type: 'customers/loadList',
      payload: {
        ...customers.queries,
        page,
        pageSize,
      },
    });
  };

  handleAddCustomer = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }

    this.setState({
      editModalVisible: true,
      editModalMode: 'create',
    });
  };

  handleEditModalClose = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }

    this.setState({
      editModalVisible: false,
    });
  };

  handleSaveCustomer = (values: any, isClose?: boolean) => {
    const { dispatch = {} as TheDispatch } = this.props;
    const { editModalMode: mode } = this.state;

    if (mode === 'create') {
      return dispatch({
        type: 'customers/addCustomer',
        payload: values,
      }).then(customerObj => {
        this.setState({
          customer: customerObj._id,
        });

        if (isClose) {
          this.handleEditModalClose();
        }

        return customerObj._id;
      });
    }

    if (mode === 'update') {
      dispatch({
        type: 'customers/updateCustomer',
        payload: {
          ...values,
          id: values.ID,
        },
      }).then(() => {});

      if (isClose) {
        this.handleEditModalClose();
      }

      return;
    }

    return;
  };

  componentDidMount() {
    const { dispatch = {} as TheDispatch } = this.props;

    dispatch({
      type: 'customers/loadList',
    });
  }

  render() {
    const {
      customers = {} as ConnectState['customers'],
      loading = {} as ConnectState['loading'],
    } = this.props;

    const { listDetails, currentCustomer } = customers;
    const { pagination } = listDetails;
    const { delModelVisible, confirmLoading } = this.state;
    return (
      <>
        <DataTable
          rows={listDetails.list}
          loading={loading.effects['customers/loadList']}
          columns={this.columnsConfig}
          showSearch
          fixedColumnsLeft={['name']}
          fixedColumnsRight={['action']}
          onSearch={this.handleSearch}
          paginationConfig={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onPageChange: this.handlePageChange,
          }}
          actions={
            <Button type="primary" style={{ width: '120px' }} onClick={this.handleAddCustomer}>
              <Icon type="plus" />
              添加客户
            </Button>
          }
        />

        <EditCustomer
          mode={this.state.editModalMode}
          open={this.state.editModalVisible}
          onModeChange={(mode) => {
            this.setState({
              editModalMode: mode,
            });
          }}
          onClose={this.handleEditModalClose}
          // onSave={this.handleSaveCustomer}
          onCustomerChange={(customer: string) => {
            this.setState({
              customer,
            });
          }}
          customer={this.state.customer}
          // loading={loading.effects['customers/findCustomerProfile']}
          values={this.state.editModalMode !== 'create' ? currentCustomer : undefined}
          onChangeMode={mode => {
            this.setState({
              editModalMode: mode,
            });
          }}
          onValueChange={values => {
            this.props.dispatch &&
              this.props.dispatch({
                type: 'customers/saveCurrentCustomer',
                payload: {
                  ...currentCustomer,
                  ...values,
                },
              });
          }}
        />
        <Modal
          title="是否要删除该零售客户？"
          visible={delModelVisible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          okType="danger"
        >
          <span>本次删除操作将是不可逆的，删除后的信息将无法恢复，请确认您是否要进行本次删除。</span>
        </Modal>
      </>
    );
  }
}

export default CustomerView;
