import React, { PureComponent } from 'react';
import { PaginationConfig, ColumnProps } from './interface';
import dot from 'dot-object';
import { TableColumnWidthInfo, PagingState, CustomPaging } from '@devexpress/dx-react-grid';
import {
  Grid,
  VirtualTable,
  // Table as BasicTable,
  // TableHeaderRow,
  TableColumnResizing,
  TableFixedColumns,
  PagingPanel,
  TableHeaderRow,
} from '@devexpress/dx-react-grid-bootstrap3';
import TableToolbar from './TableToolbar';
import classNames from 'classnames';
// import AutoSizer from 'react-virtualized-auto-sizer';
import styles from './index.less';
import { Typography, Spin } from 'antd';
import TableRow from './TableRow';
import TableHeaderCell from './TableHeaderCell';
// import { genFingerprint } from "./_utils";

import { genFingerprint, getRowID } from './_utils';
import { SpinProps } from 'antd/lib/spin';
import { isBrowser } from '@/utils/utils';
import MJIcon from '../MJIcon';

const Loading = (props: SpinProps & { children?: any }) => {
  const antIcon = <MJIcon type="icon-Loading" style={{ fontSize: 45 }} spin />;
  return (
    <div className={styles.loading}>
      <Spin {...props} indicator={antIcon} size="large" delay={600}>
        {props.children}
      </Spin>
    </div>
  );
};

const LoadingFirst = (props: SpinProps & { children?: any }) => {
  const antIcon = <MJIcon type="icon-Loading" style={{ fontSize: 45 }} spin />;
  const theStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  } as React.CSSProperties;
  return (
    <div style={theStyle}>
      <Spin {...props} indicator={antIcon} size="large" delay={600}>
        {props.children}
      </Spin>
    </div>
  );
};

interface DataTableProps<T> {
  title?: string;
  disableToolbar?: boolean;
  toolbar?: React.ReactNode | false;
  searchPlaceholder?: string;
  onSearch?: (value: any) => void;
  actions?: React.ReactNode;
  columns?: ColumnProps<T>[];
  rows: T[];
  showPagination?: boolean;
  fixedColumnsLeft?: string[];
  fixedColumnsRight?: string[];
  paginationConfig?: PaginationConfig;
  showSearch?: boolean;
  loading?: boolean;
  width?: number;
}

interface DataTableState<T> {
  columns?: ColumnProps<T>[];
  cols?: any[];
  showTable?: boolean;
  colsMapper?: {
    [key: string]: ColumnProps<T>;
  };
}

const DefaultColumnWidth = 100;

const Root = ({ width = '100%', height = '100%' }: { width: any; height: any }) => (props: any) => (
  <Grid.Root {...props} style={{ height, width }} />
);

class DataTable<T> extends PureComponent<DataTableProps<T>, DataTableState<T>> {
  delayID: any = null;

  static defaultProps = {
    rows: [],
    // cols: [],
    // columns: [],
    // colsMapper: {},
  };

  state: DataTableState<any> = {
    columns: [],
    cols: [],
    colsMapper: {},
    showTable: false,
  };

  constructor(props: any) {
    super(props);
    this.delayShow();
    this.listenResizeEvent();
  }

  static getDerivedStateFromProps(nextProps: DataTableProps<any>, prevState: DataTableState<any>) {
    const { columns = [] } = nextProps || {};
    const { columns: oldColumns } = prevState || {};

    if (genFingerprint(oldColumns) !== genFingerprint(columns)) {
      // const rows = [];
      const cols = [];
      const colsMapper = {};
      for (const col of columns) {
        // col.
        cols.push({
          name: col.dataIndex,
          title: col.title,
        });
        colsMapper[col.dataIndex] = col;
      }

      return {
        ...prevState,
        columns: columns,
        cols,
        colsMapper,
      };
    }
    return null;
  }

  getRows = () => {
    const { colsMapper } = this.state;
    const { rows = [] } = this.props;

    const newRows = rows.map((row, index) => {
      const newRow: any = {};
      for (const key in colsMapper) {
        const value = dot.pick(key, row);
        const config = colsMapper[key];
        if (config && config.render) {
          newRow[key] = config.render(value, row, index);
        } else {
          newRow[key] = value || '--';
        }
      }

      return newRow;
    });
    return newRows;
  };

  get columnsWidth(): Array<TableColumnWidthInfo> {
    const { columns = [] } = this.props;
    const widthConfig: Array<TableColumnWidthInfo> = columns.map(column => {
      return {
        columnName: column.dataIndex,
        width: column.width || DefaultColumnWidth,
      };
    });

    return widthConfig;
  }

  get columnExtensions(): Array<any> {
    const { columns = [] } = this.props;
    const config: Array<any> = columns.map(column => {
      return {
        key: column.key || column.dataIndex,
        columnName: column.dataIndex,
        align: column.align || 'left',
        wordWrapEnabled: column.wordWrapEnabled || false,
      };
    });

    return config;
  }

  onCurrentPageChange = (currentPage: number) => {
    const { paginationConfig = {} } = this.props;

    const { onPageChange, pageSize } = paginationConfig;

    if (onPageChange) {
      onPageChange(currentPage + 1, pageSize);
    }
  };

  onPageSizeChange = (pageSize: number) => {
    const { paginationConfig = {} } = this.props;

    const { onPageChange, current = 1 } = paginationConfig;
    // if (onShowSizeChange) {
    //   onShowSizeChange(current, pageSize);
    // }

    if (onPageChange) {
      onPageChange(current, pageSize);
    }
  };

  componentWillUnmount() {
    clearTimeout(this.delayID);
    this.removeListenResizeEvent();
  }

  delayShow = () => {
    // console.log('on resize');
    this.disableTable();
    this.delayID = setTimeout(() => {
      this.enableTable();
    }, 1000);
  };

  enableTable = () => {
    this.setState({
      showTable: true,
    });
  };

  disableTable = () => {
    this.setState({
      showTable: false,
    });
  };

  listenResizeEvent = () => {
    if (isBrowser()) {
      window.addEventListener('resize', this.delayShow);
    }
  };

  removeListenResizeEvent = () => {
    if (isBrowser()) {
      document.removeEventListener('resize', this.delayShow);
    }
  };

  renderToolbar = () => {
    const {
      toolbar,
      disableToolbar = false,
      onSearch,
      showSearch,
      actions,
      searchPlaceholder,
    } = this.props;
    if (disableToolbar) {
      return null;
    }
    return toolbar ? (
      toolbar
    ) : (
      <TableToolbar
        actions={actions}
        onSearch={onSearch}
        placeholder={searchPlaceholder}
        showSearch={showSearch}
      />
    );
  };

  render() {
    const {
      title,
      // columns,
      // width,
      paginationConfig = {},
      fixedColumnsLeft,
      fixedColumnsRight,
      showPagination,
      loading = false,
    } = this.props;

    const rows = this.getRows();
    const { current = 1, pageSize = 15, total = 0 } = paginationConfig;
    return (
      <div className={classNames(styles.root)}>
        {title && (
          <div
            style={{
              width: '100%',
            }}
          >
            <Typography.Title level={4}>{title}</Typography.Title>
          </div>
        )}

        {this.renderToolbar()}

        <div className={styles.gridContent}>
          <div style={{ width: '100%', height: '100%' }}>
            {!this.state.showTable ? (
              <LoadingFirst />
            ) : (
              <>
                <Grid
                  rows={rows}
                  columns={this.state.cols || []}
                  getRowId={getRowID}
                  rootComponent={Root({ width: '100%', height: '100%' })}
                >
                  <VirtualTable
                    height={'100%'}
                    // height="auto"
                    rowComponent={TableRow}
                    columnExtensions={this.columnExtensions}
                  />

                  <TableColumnResizing defaultColumnWidths={this.columnsWidth} />

                  <TableHeaderRow cellComponent={TableHeaderCell} />

                  <TableFixedColumns
                    leftColumns={fixedColumnsLeft || []}
                    rightColumns={fixedColumnsRight || []}
                  />

                  <PagingState
                    currentPage={current - 1}
                    pageSize={pageSize}
                    onCurrentPageChange={this.onCurrentPageChange}
                    onPageSizeChange={this.onPageSizeChange}
                  />

                  <CustomPaging totalCount={total} />

                  {showPagination === false ? null : (
                    <>
                      <PagingPanel />
                    </>
                  )}
                </Grid>
                {loading && <Loading wrapperClassName="loading" />}
              </>
            )}
          </div>
          {/* <AutoSizer style={{ width: '100%', height: '100%' }}>
            {
              
              ({ width, height }) => {
                return (
                  <>
                  <Grid
                    rows={rows}
                    columns={this.state.cols || []}
                    getRowId={getRowID}
                    rootComponent={Root({ width, height: height - 2 })}
                  >
                    <VirtualTable
                      height={height}
                      // height="auto"
                      rowComponent={TableRow}
                      
                      columnExtensions={this.columnExtensions}
                    />

                    <TableColumnResizing
                      defaultColumnWidths={this.columnsWidth}
                    />

                    <TableHeaderRow 
                      cellComponent={TableHeaderCell}
                    />

                    <TableFixedColumns 
                      leftColumns={fixedColumnsLeft || []}
                      rightColumns={fixedColumnsRight || []}
                    />

                    <PagingState 
                      currentPage={current - 1}
                      pageSize={pageSize}
                      onCurrentPageChange={this.onCurrentPageChange}
                      onPageSizeChange={this.onPageSizeChange}
                    />

                    <CustomPaging 
                      totalCount={total}
                    />

                    {
                      showPagination === false ? (
                        null
                      ) : (
                        <>
                          <PagingPanel />      
                        </>
                      )
                    }

                  </Grid>
                    
                  </>
                )
              }
            }
          </AutoSizer> */}
        </div>
      </div>
    );
  }
}

export default DataTable;
