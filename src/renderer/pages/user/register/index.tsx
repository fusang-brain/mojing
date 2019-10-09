import { PureComponent } from "react";
import { Alert, Typography } from 'antd';
import { Link } from "umi";
import { FormComponentProps } from 'antd/es/form';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import styles from '../login/style.less';
import LoginComponents from '../login/components/Login';
import { TheDispatch, BaseProps } from "@/models/connect";
import { connect } from "dva";

const { UserName, Tab, Mobile, Password, Submit, Captcha } = LoginComponents;

interface RegisterViewProps extends BaseProps {

}

@connect()
class RegisterView extends PureComponent<RegisterViewProps> {

  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  handleSubmit = (err: unknown, values: any) => {
    if (!this.loginForm) return;

    this.loginForm.validateFieldsAndScroll((err: unknown, values: any) => {
      if (err) {
        return;
      }

      const { dispatch = {} as TheDispatch } = this.props;

      dispatch({
        type: 'login/register',
        payload: {
          validateCode: values.code,
          user: {
            password: values.password,
            realname: values.realname,
            mobile: values.mobile,
          },
        },
      });

    });
  };

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  handleGetCaptcha = () => {
    // if (this.loginForm) {
    //   this.loginForm.validateFieldsAndScroll(['password'])
    // }
    return new Promise<boolean>((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }
      this.loginForm.validateFieldsAndScroll(
        ['mobile'],
        {},
        async (err: unknown, values: any) => {
          if (err) {
            reject(err);
          } else {
            const { dispatch = {} as TheDispatch } = this.props;
            try {
              const success = await ((dispatch({
                type: 'login/getRegisterCaptcha',
                payload: {
                  mobile: values['mobile'],
                },
              }) as unknown) as Promise<unknown>);
              resolve(!!success);
            } catch (error) {
              reject(error);
            }
          }
        },
      );
    });
  }

  render() {

    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={'signup'}
          // onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          onCreate={(form?: FormComponentProps['form']) => {
            this.loginForm = form;
          }}
        >
          <Tab key="signup" tab={formatMessage({ id: 'user-register.register.tab' })}>

            <UserName
              name="realname"
              placeholder={'真实姓名'}
              rules={[
                {
                  required: true,
                  message: '请填写真实姓名',
                }
              ]}
            />

            <Mobile
              name="mobile"
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
              placeholder={`${formatMessage({ id: 'user-login.register.password' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'user-login.password.required' }),
                },
              ]}
            />

            <Captcha 
              name="code"
              onGetCaptcha={this.handleGetCaptcha}
              getCaptchaSecondText={'s'}
              getCaptchaButtonText={`${formatMessage({ id: 'user-login.register.get-verification-code' })}`}
              placeholder={`${formatMessage({ id: 'user-login.register.code'})}`}
            />
          </Tab>
          
          <Submit>
            <FormattedMessage id="user-login.register.register" />
          </Submit>

          <Typography>我已有账号 <Link to="/user/login">直接登录</Link></Typography>
          
        </LoginComponents>
      </div>
    )
  }
}

export default RegisterView;
