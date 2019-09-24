import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/es/select';
import { connect } from 'dva';

interface SelectOperatorProps extends SelectProps<any> {
  // operators?: ConnectState['global']['operators'];
}

@connect()
class SelectStock extends PureComponent<SelectOperatorProps> {
  render() {
    let stocks = [
      {
        id: '0',
        name: '本店仓库',
      },
    ];

    // const { operators = [], ...restProps } = this.props;
    return (
      <Select {...this.props}>
        {stocks.map((stock: any) => (
          <Select.Option key={stock.id} value={stock.id}>
            {stock.name}
          </Select.Option>
        ))}
      </Select>
    );
  }
}

export default SelectStock;
