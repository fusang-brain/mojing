import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Tag } from 'antd';
import StandardTableCard from '@/components/DataTable/StandardTableCard';
import DataTable from '@/components/DataTable';
import { ConnectState, BaseProps, TheDispatch } from '@/models/connect';
import { connect } from 'dva';
import { ColumnProps } from '@/components/DataTable/interface';
import ColumnRenders from '@/components/DataTable/ColumnRenders';

interface IStockQueryView extends BaseProps {
  config?: ConnectState['settings']['systemSettings'];
  stockQuery?: ConnectState['stockQuery'];
}

@connect((s: ConnectState) => ({
  config: s.settings.systemSettings,
  stockQuery: s.stockQuery,
}))
class StockQueryView extends PureComponent<IStockQueryView> {
  get tableColumns(): ColumnProps<any>[] {
    return [
      {
        title: '商品名称',
        dataIndex: 'productInfo.name',
        align: 'left',
        width: 200,
      },
      {
        title: '商品批次',
        dataIndex: 'productBatchInfo.batchNumber',
        width: 100,
      },
      {
        title: '商品类型',
        dataIndex: 'productInfo.kind',
        width: 100,
        render: (val: string, record: any) => {
          const { config = {} as ConnectState['settings']['systemSettings'] } = this.props;

          if (!val) {
            return <Tag>其他</Tag>;
          }

          if (+val === 0) {
            return <Tag color={config.colors.kind01}>普通商品</Tag>;
          }

          if (+val === 1) {
            return <Tag color={config.colors.kind02}>光学镜片</Tag>;
          }

          if (+val === 2) {
            return <Tag color={config.colors.kind03}>隐形眼镜</Tag>;
          }

          if (+val === 3) {
            return <Tag color={config.colors.kind04}>服务项目</Tag>;
          }

          return <Tag>未知</Tag>;
        },
      },
      {
        title: '规格',
        dataIndex: 'guige',
        width: 250,
        // render: ColumnRenders.Ellipsis,
      },
      {
        title: '失效日期',
        dataIndex: 'productBatchInfo.expirationDate',
        width: 150,
        render: ColumnRenders.Date,
      },
      {
        title: '库存量',
        dataIndex: 'total',
        width: 100,
        // render: ColumnRenders.Ellipsis,
      },
      {
        title: '零售单价',
        dataIndex: 'productInfo.salePrice',
        width: 100,
        // render: ColumnRenders.Amount,
      },
      {
        title: '总金额',
        dataIndex: 'totalPrice',
        width: 100,
        render: (val: string, record: any) => {
          let amount = 0;
          const { productInfo = {} } = record;
          amount = productInfo.salePrice * record.total;

          return <span>{amount}</span>;
        },
      },
    ];
  }

  handleChangePage = (page: number, pageSize?: number) => {
    const { dispatch = {} as TheDispatch } = this.props;

    dispatch({
      type: 'stockQuery/loadList',
      payload: {
        page: page,
        pageSize: pageSize,
      },
    });
  };

  componentDidMount() {
    const { dispatch = {} as TheDispatch } = this.props;

    dispatch({
      type: 'stockQuery/loadList',
    });
  }

  render() {
    const { stockQuery: { listDetails } = {} as ConnectState['stockQuery'] } = this.props;

    const { pagination } = listDetails;
    return (
      <PageHeaderWrapper>
        <StandardTableCard>
          <DataTable
            disableToolbar
            columns={this.tableColumns}
            rows={listDetails.list}
            paginationConfig={{
              current: pagination.page || 1,
              pageSize: pagination.pageSize || 15,
              total: pagination.total || 0,
              onPageChange: this.handleChangePage,
            }}
          />
        </StandardTableCard>
      </PageHeaderWrapper>
    );
  }
}

export default StockQueryView;
