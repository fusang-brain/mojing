import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/es/select';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';

interface SelectOperatorProps extends SelectProps<any> {
  operators?: ConnectState['global']['operators'];
}

@connect((s: ConnectState) => ({
  operators: s.global.operators,
}))
class SelectOperator extends PureComponent<SelectOperatorProps> {
  render() {
    const { operators = [], ...restProps } = this.props;
    return (
      <Select {...restProps}>
        {operators.map((operator: any) => (
          <Select.Option key={operator._id} value={operator._id}>
            {operator.realname}
          </Select.Option>
        ))}
      </Select>
    );
  }
}

export default SelectOperator;
