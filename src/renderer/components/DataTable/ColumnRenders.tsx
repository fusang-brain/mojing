import React from 'react';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
// import Ellipsis from '../Ellipsis/Ellipsis';
import moment from 'moment';
import numeral from 'numeral';

const EllipsisRender = () => (val: string, record: any) => {
  if (!val) {
    return <span>--</span>;
  }

  return (
    <span>
      <Ellipsis lines={1}>{val}</Ellipsis>
    </span>
  );
};

const DateRender = () => (val: string, record: any) => {
  if (!val) {
    return <span>--</span>;
  }

  return <span>{moment(val).format('YYYY-MM-DD')}</span>;
};

const TimeRender = () => (val: string, record: any) => {
  if (!val) {
    return <span>--</span>;
  }

  return <span>{moment(val).format('YYYY-MM-DD')}</span>;
};

const AmountRender = () => (val: any) => {
  if (!val) {
    return <span>¥ {numeral(0).format('0,0.00')}</span>;
  }

  return <Ellipsis lines={1}>{`¥ ${numeral(+val || 0).format('0,0.00')}`}</Ellipsis>;
};

export default {
  Ellipsis: EllipsisRender(),
  Date: DateRender(),
  Time: TimeRender(),
  Amount: AmountRender(),
  Simple: (val: string) => {
    if (val) {
      return <span>--</span>;
    }

    return <span>{val}</span>;
  },
};
