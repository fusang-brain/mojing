import { PureComponent } from "react";
import { Alert, Checkbox, Button } from 'antd';
import { router } from "umi";
import { FormComponentProps } from 'antd/es/form';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import styles from '../login/style.less';
import LoginComponents from '../login/components/Login';

const { Tab, Mobile, Password, Submit } = LoginComponents;

class RegisterView extends PureComponent {

  loginForm: FormComponentProps['form'] | undefined | null = undefined;


  handleSubmit = (err: unknown, values: any) => {
    // console.log(values, 'login submit');
  };

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {

    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={'account'}
          // onTabChange={this.onTabChange}
          // onSubmit={this.handleSubmit}
          // onCreate={(form?: FormComponentProps['form']) => {
          //   this.loginForm = form;
          // }}
        >
          <Tab key="account" tab={formatMessage({ id: 'user-register.register.tab' })}>
            <Mobile
              name="username"
              placeholder={formatMessage({ id: 'user-login.phone-number.placeholder' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'user-login.phone-number.required' }),
                },
                {
                  pattern: /^1\d{10}$/,
                  message: formatMessage({ id: 'user-login.phone-number.wrong-format' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: 'user-login.login.password' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'user-login.password.required' }),
                },
              ]}
            />
          </Tab>
          <div>
            <Checkbox>
              <FormattedMessage id="user-login.login.remember-me" />
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              <FormattedMessage id="user-login.login.forgot-password" />
            </a>
          </div>
          <Submit>
            <FormattedMessage id="user-login.login.login" />
          </Submit>
          <Button
              onClick={() => {
                router.push('/user/login');
              }}
            >
              login
          </Button>
        </LoginComponents>
      </div>
    )
  }
}

export default RegisterView;
