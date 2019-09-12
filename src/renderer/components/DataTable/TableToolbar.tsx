import React, { PureComponent } from 'react';
import styles from './TableToolbar.less';
import { Input } from 'antd';

interface TableToolbarProps {
  placeholder?: string;
  width?: number;
  actions?: React.ReactNode;
  showSearch?: boolean;
  children?: React.ReactNode;
  onSearch?: (value: any) => void;
}

interface TableToolbarState {
  hasSearch?: boolean;
  searchValue?: any;
  lastSearch?: any;
}

export default class TableToolbar extends PureComponent<TableToolbarProps, TableToolbarState> {
  render() {
    const {
      placeholder = '搜索:',
      showSearch,
      onSearch = (value: any) => {},
      width = 200,
      actions,
      children,
    } = this.props;
    return (
      <div className={styles.toolbar}>
        {showSearch && (
          <Input.Search placeholder={placeholder} onSearch={onSearch} style={{ width }} />
        )}
        <div className={styles.actions}>{children || actions}</div>
      </div>
    );
  }
}
