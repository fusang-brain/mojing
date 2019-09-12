import React, { PureComponent, FormEvent } from 'react';
import { Form, Empty, Input, Typography, Row, Col, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import styles from './form.less';
import AmountInput from '@/components/DataEntry/AmountInput';
import { formatMessage } from 'umi-plugin-locale';
import { genProductCode } from '@/utils/helper';
const FormItem = Form.Item;

interface IServiceProductFormProps extends FormComponentProps {
  onSubmit?: (values: any) => Promise<any>;
  loading?: boolean;
}

interface FormState {
  productCode?: string;
}

class ServiceProductForm extends PureComponent<IServiceProductFormProps, FormState> {
  state: FormState = {
    productCode: genProductCode(),
  };

  handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    if (form) {
      const { validateFieldsAndScroll } = form;
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.kind = '3';
          values.salePrice = Number(values.salePrice);
          values.unitPurchasePrice = Number(values.unitPurchasePrice);
          onSubmit &&
            onSubmit(values).then(ok => {
              if (ok) {
                form.resetFields();
                this.setState({
                  productCode: genProductCode(),
                });
              }
            });
        }
      });
    }
  };

  getFieldValue = (key: string) => {
    const { form } = this.props;
    if (!form) {
      return null;
    }
    return form.getFieldValue(key);
  };

  render() {
    const { form } = this.props;
    if (!form) {
      return <Empty />;
    }

    const { getFieldDecorator } = form;

    return (
      <Form className={styles.formContainer} onSubmit={this.handleSubmit}>
        <div className={styles.form}>
          <div className={styles.formCard}>
            <div className={styles.baseInfo}>
              <Typography.Title level={3}>基本信息</Typography.Title>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <FormItem label="商品条码">
                    {getFieldDecorator('code', {
                      initialValue: this.state.productCode,
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'product.code.required' }),
                        },
                      ],
                    })(<Input placeholder="商品条码" size="large" />)}
                  </FormItem>
                </Col>

                <Col xs={24} sm={12}>
                  <FormItem label="商品名称">
                    {getFieldDecorator('name', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'product.name.required' }),
                        },
                      ],
                    })(<Input placeholder="商品名称" size="large" />)}
                  </FormItem>
                </Col>

                <Col xs={24} sm={12}>
                  <FormItem label="商品售价">
                    {getFieldDecorator('salePrice', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'product.salePrice.required' }),
                        },
                      ],
                    })(<AmountInput size="large" />)}
                  </FormItem>
                </Col>

                <Col xs={24} sm={12}>
                  <FormItem label="进货价">
                    {getFieldDecorator('unitPurchasePrice', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'product.unitPurchasePrice.required' }),
                        },
                      ],
                    })(<AmountInput size="large" />)}
                  </FormItem>
                </Col>

                <Col xs={24} sm={12}>
                  <FormItem label="生产企业">
                    {getFieldDecorator('manufacturers')(
                      <Input placeholder="生产企业" size="large" />,
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
          </div>
        </div>

        <div className={styles.formFooter}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </div>
      </Form>
    );
  }
}

export default Form.create<IServiceProductFormProps>()(ServiceProductForm);
