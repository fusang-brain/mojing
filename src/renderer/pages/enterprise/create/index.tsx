import React, { Component } from 'react';
import { Drawer, Button, Typography, Steps, Form, Empty, Input, Modal } from 'antd';
// import Grid from 'antd/lib/card/Grid';
import styles from './styles.less';
import { BaseProps, ConnectState } from '@/models/connect';
import { FormProps } from 'antd/lib/form';
import TextArea from 'antd/es/input/TextArea';
import classnames from 'classnames';
import { connect } from 'dva';
import { CurrentUser } from '@/models/user';

// import { PageHeaderWrapper } from "@ant-design/pro-layout";
// import { Card, Typography } from 'antd';

const FormItem = Form.Item;

interface CreateEnterpriseProps extends FormProps, BaseProps {
  currentUser: CurrentUser;
}

interface CreateEnterpriseState {
  current: number;
  selectedVersion: 'free' | 'pro';
  enterpriseInfo: {
    name: string;
    description: string;
  };
}

interface StepType {
  id: string;
  title: string;
  content: React.ReactNode;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 10,
      offset: 0,
    },
  },
};

const buttonFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 10,
      offset: 8,
    },
  },
};

@connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))
class CreateEnterprise extends Component<CreateEnterpriseProps, CreateEnterpriseState> {
  state: CreateEnterpriseState = {
    current: 0,
    selectedVersion: 'pro',
    enterpriseInfo: {
      name: '',
      description: '',
    },
  };

  selectVersion = (version: 'free' | 'pro') => () => {
    this.setState({
      selectedVersion: version,
    });
  };

  get steps() {
    const steps: StepType[] = [
      {
        id: 'start',
        title: '企业信息',
        content: this.renderBaseInfoForm(),
      },
      {
        id: 'price',
        title: '开通',
        content: this.renderPrice(),
      },
    ];

    return steps;
  }

  prevStep = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    const { current } = this.state;
    let currentStep = current - 1;
    if (currentStep < 0) {
      currentStep = 0;
    }
    this.setState({
      current: currentStep,
    });
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { form } = this.props;

    if (form) {
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log(values);
          this.setState({
            current: this.state.current + 1,
            enterpriseInfo: {
              name: values.name,
              description: values.description,
            },
          });
        }
      });
    }
  };

  handleLogout = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const { dispatch } = this.props;
    Modal.warning({
      title: '登出账户',
      content: '您是否要登出您当前登录的账户?',
      okText: '确定',
      onOk: () => {
        dispatch({
          type: 'login/logout',
          noRedirect: true,
        });
      },
    });
  };

  renderBaseInfoForm = () => {
    const { form } = this.props;
    if (!form) {
      return <Empty />;
    }
    const { enterpriseInfo } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form {...formItemLayout} className={styles.formInfo} onSubmit={this.handleSubmit}>
        <div className={styles.title}>
          <Typography.Title>输入您商铺的基本信息</Typography.Title>
        </div>

        <FormItem label="企业名称" {...tailFormItemLayout}>
          {getFieldDecorator('name', {
            initialValue: enterpriseInfo.name,
            rules: [
              {
                type: 'string',
                message: '企业名称格式错误',
              },
              {
                required: true,
                message: '请输入您的企业名称',
              },
            ],
          })(<Input size="large" />)}
        </FormItem>

        <FormItem label="企业描述" {...tailFormItemLayout}>
          {getFieldDecorator('description', {
            initialValue: enterpriseInfo.description,
            rules: [
              {
                type: 'string',
                message: '企业描述格式错误',
              },
              {
                required: true,
                message: '请输入企业描述',
              },
            ],
          })(<TextArea rows={4} />)}
        </FormItem>

        <FormItem {...buttonFormItemLayout}>
          <Button type="primary" htmlType="submit">
            下一步
          </Button>
        </FormItem>
      </Form>
    );
  };

  renderPrice = () => {
    // const { form } = this.props;
    // if (!form) {
    //   return <Empty />
    // }

    // const { getFieldDecorator } = form;
    return (
      <Form {...formItemLayout} className={styles.formInfo}>
        <div className={styles.title}>
          <Typography.Title>选择您的版本</Typography.Title>
        </div>

        <div className={styles.selectButtons}>
          <div
            className={classnames(styles.button, {
              [styles.selected]: this.state.selectedVersion === 'free',
            })}
            onClick={this.selectVersion('free')}
          >
            <Typography.Title level={4} className={styles.pointer}>
              试用版
            </Typography.Title>
            <Typography.Text className={styles.pointer}>15天试用全部功能</Typography.Text>
          </div>

          <div
            className={classnames(styles.button, {
              [styles.selected]: this.state.selectedVersion === 'pro',
            })}
            onClick={this.selectVersion('pro')}
          >
            <Typography.Title level={4} className={styles.pointer}>
              商业版
            </Typography.Title>
            <Typography.Text className={styles.pointer}>2880 元/年</Typography.Text>
          </div>
        </div>

        <div className={styles.footer}>
          <Button onClick={this.prevStep} type="dashed" style={{ marginRight: '15px' }}>
            上一步
          </Button>
          <Button type="primary">开通</Button>
        </div>
      </Form>
    );
  };

  renderTitle = () => {
    const { currentUser } = this.props;
    const { enterprises = [] } = currentUser;
    const enterpriseCount = enterprises.length;
    return (
      <div className={styles.header}>
        <div className={styles.title}>
          <Typography.Text>
            创建企业{enterpriseCount > 0 ? '' : ' · 开始创建您的第一个店铺吧'}{' '}
          </Typography.Text>
        </div>
        <div className={styles.action}>
          <Button
            onClick={this.handleLogout}
            style={{ float: 'right' }}
            shape="circle"
            icon="logout"
          />
        </div>
      </div>
    );
  };

  render() {
    const { current } = this.state;
    const { steps } = this;

    return (
      <>
        <Drawer
          title={this.renderTitle()}
          placement="left"
          closable={false}
          visible={true}
          width="100%"
          height="100%"
          keyboard={false}
        >
          <div className={styles.stepContainer}>
            <div className={styles.steps}>
              <Steps size="small" current={current}>
                {this.steps.map((step, index) => (
                  <Steps.Step title={step.title} key={index} />
                ))}
              </Steps>
            </div>

            <div className={styles.stepContent}>{steps[current].content}</div>
          </div>
        </Drawer>
      </>
    );
  }
}

export default Form.create()(CreateEnterprise);
