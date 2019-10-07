import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, DatePicker, Button } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { ConnectState } from '@/models/connect';
import SelectOperator from '@/components/Selector/SelectOperator';
import SelectStock from '@/components/Selector/SelectStock';
import moment from 'moment';
import styles from './styles.less';
import { genOrderNO } from '@/utils/helper';

interface OrderPaneProps extends FormComponentProps {
  onSave?: (values: any) => Promise<any>;
  kind: 'instock' | 'outstock';
  orderModel?: ConnectState['instock'] | ConnectState['outstock'];
}

interface OrderPaneState {
  loading?: boolean;
  orderNO?: string;
}

const FormItem = Form.Item;

class OrderPane extends PureComponent<OrderPaneProps, OrderPaneState> {
  state: OrderPaneState = {
    loading: false,
    orderNO: genOrderNO(),
  };

  handleSubmit = (ev?: React.FormEvent<HTMLFormElement>) => {
    if (ev) {
      ev.preventDefault();
    }

    const { form } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (err) return;

      this.setState({
        loading: true,
      });

      if (this.props.onSave) {
        this.props.onSave(values).then(() => {
          this.setState({
            loading: false,
            orderNO: genOrderNO(),
          });
        });
      }
    });
  };

  render() {
    const { form, orderModel = { currentOrder: {} } } = this.props;
    const { getFieldDecorator } = form;

    const { currentOrder = {} } = orderModel;
    return (
      <div className={styles.orderPane}>
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="单号">
                {getFieldDecorator('orderNO', {
                  initialValue: currentOrder.orderNO || this.state.orderNO,
                })(<Input />)}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem label="标题">
                {getFieldDecorator('title', {
                  initialValue: currentOrder.title,
                })(<Input />)}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem label={this.props.kind === 'instock' ? '进货日期' : '出货日期'}>
                {getFieldDecorator(this.props.kind === 'instock' ? 'inStockTime' : 'outStockTime', {
                  initialValue: moment(
                    currentOrder[this.props.kind === 'instock' ? 'inStockTime' : 'outStockTime'],
                  ),
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem label="验收员">
                {getFieldDecorator('checker', {
                  initialValue: currentOrder.checker,
                })(<SelectOperator />)}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem label={this.props.kind === 'instock' ? '收货仓库' : '出货仓库'}>
                {getFieldDecorator('stock', {
                  initialValue: currentOrder.stock,
                })(<SelectStock />)}
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem label="备注">
                {getFieldDecorator('note', {
                  initialValue: currentOrder.note,
                })(<Input.TextArea />)}
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem>
                <Button loading={this.state.loading} htmlType="submit">
                  下一步
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Form.create<OrderPaneProps>()(OrderPane);
