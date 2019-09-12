import React from 'react';

import { Table } from '@devexpress/dx-react-grid-bootstrap3';

interface BaseTableRowProps extends Table.DataRowProps {
  // tableRowProps?: TableRowProps;
}

const BaseTableRowComponent: React.SFC<BaseTableRowProps> = ({ children, ...restProps }) => {
  // restProps.row

  return (
    <>
      <Table.Row row={restProps.tableRow} {...restProps}>
        {children}
      </Table.Row>
    </>
  );
};

export default BaseTableRowComponent;
