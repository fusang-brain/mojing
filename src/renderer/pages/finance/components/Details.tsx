import React, { PureComponent } from 'react';
import StandardTableCard from '@/components/DataTable/StandardTableCard';
import styles from './Details.less';
import { DatePicker, Tag } from 'antd';
import classNames from 'classnames';
import { BaseProps, ConnectState, TheDispatch } from '@/models/connect';
import { connect } from 'dva';
import DataTable from '@/components/DataTable';
import { ColumnProps } from '@/components/DataTable/interface';
import { IFinanceItem } from '../models/finance';
import * as colors from '@ant-design/colors';
import moment, { Moment } from 'moment';
import Button from 'antd/es/button';
import { getLabelByValue } from './Categories';

interface DetailsProps extends BaseProps, BaseProps {
  finance?: ConnectState['finance'];
  config?: ConnectState['settings']['systemSettings'];
}

interface DetailsState {
  selectedDate?: Moment | any;
}

@connect((s: ConnectState) => ({
  finance: s.finance,
  loading: s.loading,
  config: s.settings.systemSettings,
}))
class Details extends PureComponent<DetailsProps, DetailsState> {
  state: DetailsState = {
    selectedDate: moment(),
  };

  get tableColumns(): ColumnProps<IFinanceItem>[] {
    // const { config = {} as ConnectState['settings']['systemSettings'] }  = this.props;
    // const classes = useStyles();

    return [
      {
        dataIndex: 'kind',
        title: '类型',
        width: 200,
        render: txt => {
          return (
            <Tag color={+txt === 0 ? colors.red.primary : colors.green.primary}>
              {+txt === 0 ? '支出' : '收入'}
            </Tag>
          );
          // return <Tag className={+txt === 0 ? classes.chipRed : classes.chipGreen} label={+txt === 0 ? '支出' : '收入'} />
        },
      },
      {
        dataIndex: 'category',
        title: '类别',
        render: txt => {
          return <Tag>{getLabelByValue(txt)}</Tag>;
        },
      },
      {
        dataIndex: 'operator',
        title: '操作人',
        width: 200,
        render: (txt, record) => {
          return <span>{txt.realname}</span>;
        },
      },
      {
        dataIndex: 'amount',
        title: '金额',
        width: 200,
      },
      {
        dataIndex: 'date',
        title: '日期',
        width: 250,
        render: txt => {
          return <span>{moment(txt).format('YYYY-MM-DD')}</span>;
        },
      },
      {
        dataIndex: 'createdAt',
        title: '创建时间',
        // width: 150,
        width: 220,
        render: txt => {
          return <span>{moment(txt).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        dataIndex: 'action',
        title: '操作',
        align: 'left',
        render: (_, record) => {
          return (
            // <IconButton color="secondary" >
            //   <Delete />
            // </IconButton>
            <Button icon="delete" type="danger" />
            // <AlertDialogButton
            //   title="是否要删除该记录?"
            //   content="本次删除操作将是不可逆的，删除后的信息将无法恢复，请确认您是否要进行本次删除。"
            //   component={IconButton}
            //   buttonProps={{
            //     color: 'secondary',
            //   }}
            //   onOK={this.handleDeleteOne(record)}
            // >
            //   <Delete />
            // </AlertDialogButton>
          );
        },
      },
    ];
  }

  get statistic() {
    const defaultTotal = {
      total: 0,
      incomeTotal: 0,
      outTotal: 0,
    };
    const { finance } = this.props;
    if (!finance) {
      return defaultTotal;
    }
    const { statistic } = finance;
    const { incomeTotal = 0, outTotal = 0 } = statistic || {};
    return {
      total: incomeTotal - outTotal,
      incomeTotal,
      outTotal,
    };
  }

  handleDateChange = (date: Moment | null, dateString: string) => {
    if (!date) {
      date = moment();
      this.setState({
        selectedDate: date,
      });
    }

    const {
      dispatch = {} as TheDispatch,
      finance: { queries } = {} as ConnectState['finance'],
    } = this.props;

    dispatch({
      type: 'finance/loadList',
      payload: {
        ...queries,
        date: date.toISOString(),
      },
    });

    dispatch({
      type: 'finance/loadStatistic',
      payload: {
        date: date.toISOString(),
      },
    });
  };

  renderTableQuery = () => {
    const statistic = this.statistic;

    return (
      <div className={styles.query}>
        <div>
          <DatePicker.MonthPicker
            defaultValue={this.state.selectedDate}
            onChange={this.handleDateChange}
          />
        </div>

        <div>
          <div className={styles.totalPanel}>
            <div className={classNames(styles.box, styles.income)}>
              <div className={styles.label}>收入</div>
              <div className={styles.content}>{statistic.incomeTotal || 0}</div>
            </div>
            <div className={classNames(styles.box, styles.out)}>
              <div className={styles.label}>支出</div>
              <div className={styles.content}>{statistic.outTotal || 0}</div>
            </div>

            <div className={classNames(styles.box, styles.total)}>
              <div className={styles.label}>总计</div>
              <div className={styles.content}>{statistic.total}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  handleChangePage = (current: number, pageSize?: number) => {
    // const { current, pageSize } = pagination;
    const {
      dispatch = {} as TheDispatch,
      finance: { queries: { date } } = {} as ConnectState['finance'],
    } = this.props;

    dispatch({
      type: 'finance/loadList',
      payload: {
        date: date || moment().toISOString(),
        page: current,
        pageSize: pageSize,
      },
    });
  };

  render() {
    const {
      loading = {} as ConnectState['loading'],
      finance: { listDetails } = {} as ConnectState['finance'],
    } = this.props;
    const { pagination } = listDetails;

    return (
      <StandardTableCard query={this.renderTableQuery()}>
        <DataTable
          columns={this.tableColumns}
          rows={listDetails.list}
          toolbar={false}
          fixedColumnsRight={['action']}
          loading={loading.effects['finance/loadList']}
          paginationConfig={{
            current: pagination.page || 1,
            pageSize: pagination.pageSize || 15,
            total: pagination.total || 0,
            onPageChange: this.handleChangePage,
          }}
        />
      </StandardTableCard>
    );
  }
}

export default Details;
