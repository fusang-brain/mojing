import React, { PureComponent } from 'react';
import moment from 'moment';
import { Button, Icon } from 'antd';
import { ColumnProps } from '@/components/DataTable/interface';
import DataTable from '@/components/DataTable';
import { BaseProps, ConnectState, TheDispatch } from '@/models/connect';
import { connect } from 'dva';

interface IOptometryRecordProps extends BaseProps {
  optometry?: ConnectState['optometry'];
  customer?: string;
  onRecordSelect?: (record?: any) => void;
}

@connect((s: ConnectState) => ({
  optometry: s.optometry,
  loading: s.loading,
}))
class OptometryRecord extends PureComponent<IOptometryRecordProps> {
  handlePageChange = (page: number, pageSize?: number) => {
    const {
      dispatch = {} as TheDispatch,
      optometry = {} as ConnectState['optometry'],
      customer,
    } = this.props;

    dispatch({
      type: 'optometry/loadList',
      payload: {
        page,
        pageSize,
        ...optometry.queries,
        customer: customer,
      },
    });
  };

  componentDidMount() {
    const { dispatch = {} as TheDispatch, customer } = this.props;
    dispatch({
      type: 'optometry/loadList',
      payload: {
        customer,
      },
    });
  }

  render() {
    const columnsConfig: ColumnProps<any>[] = [
      {
        title: '验光日期',
        dataIndex: 'optometryDate',
        align: 'left',
        width: 150,
        render: (date: string) => {
          return moment(date).format('YYYY年MM月DD日');
        },
      },
      {
        title: '验光师',
        dataIndex: 'optometryPersonInfo.realname',
        align: 'left',
      },
      {
        title: '创建日期',
        dataIndex: 'createdAt',
        align: 'left',
        width: 170,
        render: (date: string) => {
          return moment(date).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '操作',
        dataIndex: 'action',
        align: 'right',
        render: (txt: string, record: any) => {
          return (
            <>
              <Button
                size="small"
                onClick={() => {
                  const { onRecordSelect } = this.props;
                  if (onRecordSelect) {
                    onRecordSelect(record);
                  }
                }}
              >
                <Icon type="eye" />
              </Button>

              <Button size="small" type="danger">
                <Icon type="delete" />
              </Button>

              {/* <IconButton onClick={() => {
              const { onRecordSelect } = this.props;
              if (onRecordSelect) {
                onRecordSelect(record);
              }
            }}>
              <Visibility />
            </IconButton>
            <IconButton>
              <Edit />
            </IconButton>
            <IconButton>
              <Delete />
            </IconButton> */}
            </>
          );
        },
      },
    ];

    const {
      loading = {} as ConnectState['loading'],
      optometry = {} as ConnectState['optometry'],
    } = this.props;

    const { listDetails } = optometry;

    const { pagination } = listDetails;

    return (
      <>
        <div style={{ height: '470px', width: '400px' }}>
          <DataTable
            loading={loading.effects['optometry/loadList']}
            columns={columnsConfig}
            rows={listDetails.list}
            disableToolbar
            // fixedColumnsLeft={['optometryDate']}
            fixedColumnsRight={['action']}
            paginationConfig={{
              current: pagination.page,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onPageChange: this.handlePageChange,
            }}
          />
        </div>
      </>
    );
  }
}

export default OptometryRecord;
