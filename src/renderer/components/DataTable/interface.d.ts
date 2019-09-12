export interface ColumnProps<T> {
  title?: React.ReactNode;
  id?: React.Key;
  key?: React.Key;
  dataIndex: string;
  width?: number;
  align?: 'left' | 'right' | 'center';
  wordWrapEnabled?: boolean;
  render?: (text: any, record: T, index: number) => React.ReactNode;
}

export interface PaginationProps {
  total?: number;
  current?: number;
  pageSize?: number;
  // loading?: boolean;
  onPageChange?: (page: number, pageSize?: number) => void;
  // hideOnSinglePage?: boolean;
  // showSizeChanger?: boolean;
  // pageSizeOptions?: string[];
  // onShowSizeChange?: (current: number, size: number) => void;
  // showQuickJumper?: boolean | {
  //     goButton?: React.ReactNode;
  // };
  // showTotal?: (total: number, range: [number, number]) => React.ReactNode;
  // style?: React.CSSProperties;
  position?: 'top' | 'bottom' | 'both';
}

export interface PaginationConfig extends PaginationProps {}
