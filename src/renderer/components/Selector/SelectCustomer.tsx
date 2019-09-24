import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Select, message, Empty, Typography } from 'antd';
import { SelectProps } from 'antd/es/select';
import { AxiosResponse } from 'axios';
import Loading from '../Loading';
import { findCustomerList } from '@/services/customer';

export interface SelectCustomerProps extends SelectProps {
  productID?: string;
  onSelectOne?: (batchInfo: any, value: any) => void;
}

interface SelectCustomerState {
  data: any[];
  fetching: boolean;
}

export default class SelectCustomer extends PureComponent<
  SelectCustomerProps,
  SelectCustomerState
> {
  state: SelectCustomerState = {
    data: [],
    fetching: false,
  };

  constructor(props: SelectCustomerProps) {
    super(props);
    this.handleSearch = _.debounce(this.handleSearch, 600);
  }

  loadData = (search: string) => {
    this.setState({
      fetching: true,
    });

    findCustomerList({
      search,
    })
      .then((resp: AxiosResponse) => {
        const { data } = resp;
        this.setState({
          data: data.list || [],
          fetching: false,
        });
      })
      .catch(err => {
        this.setState({
          fetching: false,
        });
        message.error('客户信息加载错误');
      });
  };

  // @debounce(600)
  handleSearch = (values: any) => {
    this.loadData(values);
  };

  componentDidMount() {
    this.loadData('');
  }

  handleChange = (value: any, opt: any) => {
    const { onChange, onSelectOne } = this.props;

    const { data } = this.state;

    onChange && onChange(value, opt);

    const findValue = _.find(data, o => {
      return o._id === value.key;
    });

    onSelectOne && onSelectOne(findValue, value);
  };

  render() {
    const { fetching } = this.state;
    const { loading, ...restProps } = this.props;

    return (
      <Select
        {...restProps}
        labelInValue
        showSearch
        showArrow={false}
        notFoundContent={fetching ? <Loading size="small" /> : <Empty />}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        filterOption={false}
      >
        {this.state.data.map((item: any) => (
          <Select.Option key={item._id} value={item._id}>
            {item.name} ({item.mobile})
          </Select.Option>
        ))}
      </Select>
    );
  }
}
