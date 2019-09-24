import { PureComponent } from 'react';
import { Card, Form, Input, Row, Col, Button } from 'antd';
import styles from './style.less';
import { BaseProps, ConnectState, TheDispatch } from '@/models/connect';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';

interface IEnterpriseConfig extends BaseProps, FormComponentProps {
  loading?: ConnectState['loading'];
  currentEnterprise?: string;
  enterprise?: ConnectState['enterprise'];
}

@connect((s: ConnectState) => ({
  loading: s.loading,
  currentEnterprise: s.user.currentEnterprise,
  enterprise: s.enterprise,
}))
class EnterpriseConfig extends PureComponent<IEnterpriseConfig> {
  handleSave = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }
    const { form, currentEnterprise, dispatch = {} as TheDispatch } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err && currentEnterprise) {
        dispatch({
          type: 'enterprise/updateEnterpriseByID',
          payload: {
            id: currentEnterprise,
            ...values,
          },
        });
      }
    });
  };

  render() {
    const {
      enterprise = {} as ConnectState['enterprise'],
      form,
      loading = {} as ConnectState['loading'],
    } = this.props;
    const { getFieldDecorator } = form;
    const { currentEnterpriseInfo = {} } = enterprise;
    return (
      <>
        <Card title="企业设置" className={styles.card}>
          <div className={styles.inner}>
            <Form>
              <Row gutter={14}>
                <Col span={12}>
                  <Form.Item label="店铺名称">
                    {getFieldDecorator('name', {
                      initialValue: currentEnterpriseInfo.name,
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="店铺地址">
                    {getFieldDecorator('address', {
                      initialValue: currentEnterpriseInfo.address,
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="企业联系人">
                    {getFieldDecorator('linkman', {
                      initialValue: currentEnterpriseInfo.linkman,
                    })(<Input />)}
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="联系电话">
                    {getFieldDecorator('contactNumber', {
                      initialValue: currentEnterpriseInfo.contactNumber,
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="企业简介">
                    {getFieldDecorator('description', {
                      initialValue: currentEnterpriseInfo.description,
                    })(<Input.TextArea />)}
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item>
                    <Button
                      onClick={this.handleSave}
                      loading={loading.effects['enterprise/updateEnterpriseByID']}
                    >
                      保存
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </Card>
      </>
    );
  }
}

export default Form.create<IEnterpriseConfig>()(EnterpriseConfig);
