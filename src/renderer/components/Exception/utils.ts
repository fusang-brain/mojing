import { message } from 'antd';

export function NetworkError() {
  message.error('网络异常，请稍后重试');
}

export function ComponentsError() {
  message.error('组件渲染错误');
}

export function FormError() {
  message.error('表单渲染错误');
}
