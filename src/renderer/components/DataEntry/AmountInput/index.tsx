import React from 'react';
import { Input, Tooltip } from 'antd';
import { InputProps } from 'antd/es/input';

function formatNumber(value: any) {
  value += '';
  const list = value.split('.');
  const prefix = list[0].charAt(0) === '-' ? '-' : '';
  let num = prefix ? list[0].slice(1) : list[0];
  let result = '';
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}

interface Props {
  onChange?: Function;
  value?: any;
  onBlur?: Function;
}

export default class AmountInput extends React.Component<Props | InputProps> {
  onChange = (e: any) => {
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      if (this.props.onChange) this.props.onChange(value);
    }
  };

  // '.' at the end or only '-' in the input box.
  onBlur = () => {
    const { value = '', onBlur = () => {}, onChange = () => {} } = this.props;
    if (value.charAt(value.length - 1) === '.' || value === '-') {
      onChange(value.slice(0, -1));
    }
    if (onBlur) {
      onBlur();
    }
  };

  render() {
    const { value } = this.props;
    const title = value ? (
      <span className="numeric-input-title">{value !== '-' ? formatNumber(value) : '-'}</span>
    ) : (
      '输入金额'
    );
    return (
      <Tooltip trigger={'focus'} title={title} placement="topLeft" overlayClassName="numeric-input">
        <Input
          {...this.props}
          onChange={this.onChange}
          onBlur={this.onBlur}
          placeholder="输入金额"
          maxLength={25}
          prefix="￥"
          suffix="RMB"
        />
      </Tooltip>
    );
  }
}
