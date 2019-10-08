import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Icon, Tag, Empty, Tooltip, Popconfirm } from 'antd';
import DataTable from '@/components/DataTable';
// import { ColumnProps } from '@/components/DataTable/interface';
import { BaseProps, ConnectState } from '@/models/connect';
import { connect } from 'dva';
import { SystemSettingType } from '@/config/systemSettings';
import { ColumnProps } from '@/components/DataTable/interface';
import styles from './index.less';
import { router } from 'umi';
import UpdateModal from '../components/UpdateModal';

// export default (): React.ReactNode => (
//   <PageHeaderWrapper>
//     <Card>
//       <Typography.Text strong>
//         查询商品
//       </Typography.Text>
//     </Card>
//   </PageHeaderWrapper>
// );

interface IProductQueryProps extends BaseProps {
  product: ConnectState['product'];
  settings: ConnectState['settings'];
  loadingList?: boolean;
}

interface IProductItem {}

interface IProductQueryState {
  // productInfo?: any;
  updateProductVisible?: boolean;
  addBatchDialogVisible?: boolean;
  currentProductID?: string;
  updateKind?: number;
  currentProduct?: { [key: string]: any };
}

@connect(({ loading, product, settings }: ConnectState) => ({
  settings,
  product,
  loadingList: loading.effects['product/loadList'],
}))
class Query extends PureComponent<IProductQueryProps, IProductQueryState> {
  state: IProductQueryState = {
    updateProductVisible: false,
    updateKind: 0,
    addBatchDialogVisible: false,
    currentProductID: '',
    currentProduct: {},
  };

  get config(): SystemSettingType {
    const { settings } = this.props;
    return settings.systemSettings;
  }

  closeUpdateProduct = () => {
    this.setState({
      updateProductVisible: false,
    });
  }

  handleUpdateProduct = (record: any) => () => {
    // todo find product details
    const { _id } = record;

    const { dispatch } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'product/findProductInfo',
      payload: _id,
    }).then((info) => {
      // console.log(info, 'info');
      this.setState({
        currentProduct: info,
        currentProductID: info._id,
      });
    });

    this.setState({
      updateProductVisible: true,
    });
  };

  delProdcut = (record:any) =>{
    const { _id } = record;
    const { dispatch } = this.props;
    
    if (!dispatch) {
      return;
    }

    dispatch({
      type: 'product/removeProduct',
      payload:_id,
    });
  };

  get tableColumns(): ColumnProps<IProductItem>[] {
    return [
      {
        title: '商品编号',
        dataIndex: 'code',
        width: 150,

        align: 'right',
      },
      {
        title: '商品名称',
        width: 200,
        dataIndex: 'name',
        // fixed: 'left',
      },
      {
        title: '类型',
        key: 'productKindCategory',
        width: 200,
        dataIndex: 'productKindCategory',
        render: (txt: string, record: any) => {
          const { kind, category } = record;
          const config = this.config;
          const kindStr = config.stateMapper.productKind[kind];
          const categoryStr = config.stateMapper.productCategory[category] || null;
          return <Tag>{categoryStr || kindStr}</Tag>;
        },
      },
      {
        title: '厂商',
        width: 200,
        dataIndex: 'manufacturers',
      },
      {
        title: '品牌',
        width: 200,
        dataIndex: 'brand',
      },
      {
        title: '售价',
        width: 200,
        dataIndex: 'salePrice',
      },
      {
        title: '规格',
        width: 200,
        dataIndex: 'typeSpecification',
      },
      {
        title: '色号',
        dataIndex: 'colorNumber',
        width: 200,
      },
      {
        dataIndex: 'actions',
        title: '操作',
        align: 'left',
        width: 210,
        render: (_: any, record: any) => {
          // const { kind } = record;
          return (
            <div className={styles.buttonGroup}>
              <Button icon="edit" type="primary" onClick={this.handleUpdateProduct(record)} />
              <Button icon="bars" type="default">批次管理</Button>
              <Popconfirm title="确定移除商品?" onConfirm={()=>this.delProdcut(record)}>
                <Button icon="delete" type="danger"/>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
  }

  get batchTableColumns(): ColumnProps<any>[] {
    return [
      {
        title: '商品批号',
        dataIndex: 'batchNumber',
        width: 150,
        align: 'right',
      },
      {
        title: '直径',
        dataIndex: 'diameter',
        width: 100,
        align: 'left',
      },
      {
        title: '颜色',
        dataIndex: 'color',
        width: 100,
        align: 'left',
      },
      {
        title: '度数',
        dataIndex: 'diopter',
        width: 100,
        align: 'left',
      },
      {
        title: '基弧',
        dataIndex: 'BOZR',
        width: 100,
        align: 'left',
      },
    ];
  }

  handleOnAdd = () => {
    // router.push('/Product/Add');
  };

  handleDeleteOne = (record: any) => () => {
    const { dispatch } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'product/removeProduct',
      payload: record._id,
    });
  };

  handleSearch = (value: string) => {
    const { dispatch } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'product/loadList',
      payload: {
        search: value,
      },
    });
  };

  handleChangePage = (current: number, pageSize?: number) => {
    // const { current, pageSize } = pagination;

    const {
      dispatch,
      product: {
        queries: { search },
      },
    } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'product/loadList',
      payload: {
        search: search,
        page: current,
        pageSize: pageSize,
      },
    });
  };

  handleAddBatch = (record: any) => () => {
    const { dispatch } = this.props;
    this.setState(
      {
        addBatchDialogVisible: true,
        currentProductID: record.id,
      },
      () => {
        if (!dispatch) {
          return;
        }
        dispatch({
          type: 'product/loadBatchList',
          payload: {
            id: record.id,
          },
        });
      },
    );
  };

  handleSaveBatch = () => {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'product/createOneProduct',
    //   payload: {
    //     ...values,
    //     productID: this.state.currentProductID,
    //   },
    // });
    // actions.setSubmitting(false);
    // actions.resetForm();
  };

  handleCloseBatchForm = () => {
    this.setState({
      addBatchDialogVisible: false,
    });
  };

  handleSave = () => {
    // const { dispatch } = this.props;
    // const { _id, ...restBody } = values;
    // dispatch({
    //   type: 'product/updateProduct',
    //   payload: restBody,
    // }).then(ok => {
    //   if (ok) {
    //     action.resetForm();
    //     this.setState({
    //       updateProductVisible: false,
    //     });
    //   }
    // });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'product/loadList',
    });
  }

  render() {
    const {
      product,
      // loading: loadingAction,
      loadingList,
      //classes,
    } = this.props;

    if (!product) {
      return <Empty />;
    }

    const {
      listDetails,
      // batchListDetails,
    } = product;

    return (
      <>
      <PageHeaderWrapper
        content="查询店内商品"
        extraContent={
          <Button onClick={()=>{
            router.push('/product/add');
          }}>
            <Icon type="plus" />
            添加商品
          </Button>
        }
      >
        <DataTable
          onSearch={this.handleSearch}
          columns={this.tableColumns}
          rows={listDetails.list}
          loading={loadingList}
          showSearch
          fixedColumnsLeft={['code']}
          fixedColumnsRight={['actions']}
          showPagination
          paginationConfig={{
            current: listDetails.pagination.page,
            pageSize: listDetails.pagination.pageSize,
            total: listDetails.pagination.total,
            onPageChange: this.handleChangePage,
          }}
        />
      </PageHeaderWrapper>
      <UpdateModal 
        // productInfo={}
        onClose={this.closeUpdateProduct}
        productInfo={this.state.currentProduct}
        visible={this.state.updateProductVisible}
      />
      </>

    );
  }
}

export default Query;
