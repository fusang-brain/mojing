import React from 'react';

import { TableHeaderRow } from '@devexpress/dx-react-grid-bootstrap3';

interface TableHeaderCellProps extends TableHeaderRow.CellProps {
  // tableRowProps?: TableRowProps;
}

const TableHeaderCell: React.SFC<TableHeaderCellProps> = ({ children, ...restProps }) => {
  return (
    <>
      <TableHeaderRow.Cell {...restProps}>
        <div>{children}</div>
      </TableHeaderRow.Cell>
    </>
  );
};

export default TableHeaderCell;
