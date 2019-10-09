import { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DataTable from '@/components/DataTable';
import { ConnectState, BaseProps, TheDispatch } from '@/models/connect';
import { connect } from 'dva';
import { ColumnProps } from '@/components/DataTable/interface';
import moment from 'moment';
import { beautySubstr } from '@/utils/helper';
import { Input, Tag, Tooltip, Button, Icon } from 'antd';
import { router } from 'umi';

interface QueryViewProps extends BaseProps {
  sale?: ConnectState['sale'];
}

@connect((s: ConnectState) => ({
  sale: s.sale,
  loading: s.loading,
}))
class SaleQuery extends PureComponent<QueryViewProps> {
  get columnConfig(): Array<ColumnProps<any>> {
    // const { loading } = this.props;
    return [
      {
        title: '客户名称',
        width: 200,
        dataIndex: 'customer.name',
      },
      {
        title: '客户手机',
        width: 120,
        dataIndex: 'customer.mobile',
      },
      {
        title: '消费金额',
        dataIndex: 'amount',
      },
      {
        title: '销售日期',
        dataIndex: 'saleDate',
        render: val => {
          return moment(val).format('YYYY-MM-DD');
        },
      },
      {
        title: '商品信息',
        width: 400,
        dataIndex: 'products',
        render: (
          val: Array<any>,
          record: { productsCount: Array<{ id: string; count: number }> },
        ) => {
          let productValue = '';
          const { productsCount } = record;

          let pcMap = {};
          for (const pc of productsCount) {
            pcMap[pc.id] = pc.count;
          }
          for (const product of val) {
            productValue += `${beautySubstr(product.name, 15)} x ${pcMap[product.id]} \r\n`;
          }
          return (
            // <TextField
            //   disabled
            //   value={productValue}

            //   multiline
            //   rows={2}
            //   rowsMax={2}
            //   fullWidth
            //   name="productInfo"
            // />
            <Input.TextArea disabled value={productValue} rows={2} />
          );
        },
      },
      {
        title: '支付类型',
        dataIndex: 'paidType',
        render: val => {
          const paidTypeMapper = ['未知', '现金', '支付宝', '微信', '银联', '其他支付'];
          return <Tag>{paidTypeMapper[val]}</Tag>;
        },
      },
      {
        title: '操作',
        dataIndex: 'actions',
        align: 'right',
        render: (val, record) => {
          return (
            <>
              <Tooltip title="废单">
                <Button onClick={this.handleDelSale(record._id)} color="secondary">
                  <Icon type="delete" />
                </Button>
              </Tooltip>
            </>
          );
        },
      },
    ];
  }

  handleDelSale = (id: string) => () => {
    const { dispatch = {} as TheDispatch } = this.props;

    dispatch({
      type: 'sale/delSale',
      payload: id,
    });
  };

  handlePageChange = (page: number, pageSize?: number) => {
    const { dispatch = {} as TheDispatch } = this.props;

    dispatch({
      type: 'sale/loadList',
      payload: {
        page,
        pageSize,
      },
    });
  };

  handleSearch = (value: any) => {
    const { dispatch = {} as TheDispatch } = this.props;
    dispatch({
      type: 'sale/loadList',
      payload: {
        search: value,
      },
    });
  };

  componentDidMount() {
    const { dispatch = {} as TheDispatch } = this.props;

    dispatch({
      type: 'sale/loadList',
    });
  }

  render() {
    const {
      sale = {} as ConnectState['sale'],
      loading = {} as ConnectState['loading'],
    } = this.props;
    const { listDetails } = sale;

    const { pagination = {} } = listDetails;

    return (
      <PageHeaderWrapper
        title="销售记录"
        content="查询店内销售记录"
        extraContent={
          <Button type="primary" onClick={() => router.push('/sale/add')}>
            销售记账
          </Button>
        }
      >
        <DataTable
          columns={this.columnConfig}
          showSearch
          searchPlaceholder="客户名称/商品名称"
          rows={listDetails.list}
          loading={loading.effects['sale/loadList']}
          fixedColumnsRight={['actions']}
          fixedColumnsLeft={['customer.name']}
          paginationConfig={{
            pageSize: pagination.pageSize,
            current: pagination.page,
            total: pagination.total,
            onPageChange: this.handlePageChange,
          }}
          onSearch={this.handleSearch}
        />
      </PageHeaderWrapper>
    );
  }
}

export default SaleQuery;
