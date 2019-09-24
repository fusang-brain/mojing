import Spin, { SpinProps } from 'antd/lib/spin';
// import { Icon } from "antd";
import MJIcon from '../MJIcon';

const Loading = (props: SpinProps & { children?: any }) => {
  const antIcon = <MJIcon type="icon-Loading" style={{ fontSize: 45 }} spin />;
  return (
    <Spin {...props} indicator={antIcon}>
      {props.children}
    </Spin>
  );
};

export default Loading;
