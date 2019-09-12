import { message } from 'antd';

export function NetworkError() {
  message.error('网络异常，请稍后重试');
}
