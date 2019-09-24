import { PureComponent } from 'react';
import { Form, Empty, Input, Select, DatePicker, Button, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import Categories from './Categories';
import { AmountInput } from '@/components/DataEntry';
import { ConnectState } from '@/models/connect';
import { connect } from 'dva';
import moment, { Moment } from 'moment';

export interface INoteBooksFormProps extends FormComponentProps {
  operators?: ConnectState['global']['operators'];
  loading?: boolean;
  onSave?: (values: any, toNext?: boolean) => Promise<any>;
  type: 'income' | 'out';
}

interface INoteBooksFormState {
  today?: Moment;
}

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 19,
      offset: 5,
    },
  },
};

@connect((s: ConnectState) => ({
  operators: s.global.operators,
}))
class NoteBooksForm extends PureComponent<INoteBooksFormProps> {
  private andNext: boolean = false;

  state: INoteBooksFormState = {
    today: moment(),
  };

  handleSave = () => {
    this.andNext = false;
    this.handleSubmit();
  };

  handleSaveAndNext = () => {
    this.andNext = true;
    this.handleSubmit();
  };

  handleSubmit() {
    const { form, onSave, type = 'income' } = this.props;

    if (!form) {
      message.error('表单渲染错误');
      return;
    }

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.kind = type === 'income' ? 1 : 0;
        onSave &&
          onSave(values, this.andNext).then(() => {
            form.resetFields();
            this.setState({
              today: moment(),
            });
          });
      }
    });
  }

  render() {
    const { form, operators = [] } = this.props;
    if (!form) {
      return <Empty />;
    }
    const { getFieldDecorator } = form;
    return (
      <Form>
        <FormItem {...formItemLayout} label="分类">
          {getFieldDecorator('category', {
            rules: [
              {
                required: true,
                message: '请选择分类',
              },
            ],
          })(
            <Select size="large" placeholder="请选择分类">
              {Categories.map((category, index) => (
                <Select.Option key={`cate_${index}`} value={category.value}>
                  {category.label}
                </Select.Option>
              ))}
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="日期">
          {getFieldDecorator('date', {
            initialValue: this.state.today,
            rules: [
              {
                required: true,
                message: '请选择日期',
              },
            ],
          })(<DatePicker size="large" placeholder="请选择日期" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="金额">
          {getFieldDecorator('amount', {
            rules: [
              {
                required: true,
                message: '请填写金额',
              },
            ],
          })(<AmountInput size="large" placeholder="金额" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="操作人">
          {getFieldDecorator('operator', {
            rules: [
              {
                required: true,
                message: '请选择操作人',
              },
            ],
          })(
            <Select size="large" placeholder="请选择操作人">
              {operators.map((o, index) => (
                <Select.Option key={`operator_${index}`} value={o._id}>
                  {o.realname}
                </Select.Option>
              ))}
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('note')(<Input size="large" placeholder="备注" />)}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button
            loading={!this.andNext && this.props.loading}
            disabled={this.props.loading}
            onClick={this.handleSave}
            style={{ marginRight: '10px' }}
          >
            保存
          </Button>
          <Button
            loading={this.andNext && this.props.loading}
            disabled={this.props.loading}
            type="primary"
            onClick={this.handleSaveAndNext}
          >
            保存并记录下一个
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create<INoteBooksFormProps>()(NoteBooksForm);
