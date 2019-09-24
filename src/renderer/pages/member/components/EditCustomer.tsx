import React, { PureComponent } from 'react';
import {
  Drawer,
  Typography,
  Row,
  Col,
  Form,
  Input,
  Button,
  Icon,
  Popover,
  Select,
  DatePicker,
  Modal,
} from 'antd';
import styles from './EditCustomer.less';
import { FormComponentProps } from 'antd/es/form';
import { AmountInput } from '@/components/DataEntry';
import OptometryRecord from './OptometryRecord';
import { BaseProps, TheDispatch } from '@/models/connect';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-locale';
import AddOptometryRecord from './AddOptometryRecord';
import moment from 'moment';
import dot from 'dot-object';
// import lodash from 'lodash';

const FormItem = Form.Item;

interface EditCustomerViewProps extends FormComponentProps, BaseProps {
  open?: boolean;
  mode?: 'create' | 'update' | 'view';
  values?: any;
  onClose?: (ev?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onCustomerChange?: (customer: string) => void;
  onChangeMode?: (mode: 'create' | 'update' | 'view') => void;
  customer?: string;
  onValueChange?: (values: any) => void;
}

interface EditCustomerViewState {
  viewOptometryRecord?: boolean;
  openAddOptometryDialog?: boolean;
  openAlertAddOptometry?: boolean;
  saveAndClose?: boolean;
}

@connect()
class EditCustomer extends PureComponent<EditCustomerViewProps, EditCustomerViewState> {
  state: EditCustomerViewState = {
    viewOptometryRecord: false,
    openAddOptometryDialog: false,
    openAlertAddOptometry: false,
    saveAndClose: false,
  };

  getTitle = () => {
    const { mode } = this.props;

    if (mode === 'create') {
      return '新增零售客户';
    }
    if (mode === 'update') {
      return '编辑零售客户';
    }

    if (mode === 'view') {
      return '查看零售客户';
    }

    return '';
  };

  handleToEditMode = () => {
    const { onChangeMode } = this.props;

    if (onChangeMode) {
      onChangeMode('update');
    }
  };

  handleToViewMode = () => {
    const { onChangeMode } = this.props;

    if (onChangeMode) {
      onChangeMode('view');
    }
  };

  handleClose = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }

    const { onClose } = this.props;
    onClose && onClose();
  };

  toggleAddOptometryDialog = () => {
    this.setState({
      openAddOptometryDialog: !this.state.openAddOptometryDialog,
    });
  };

  closeAddOptometryDialog = () => {
    this.setState({
      openAddOptometryDialog: false,
    });
  };

  handleSaveBaseInfo = () => {
    const { form, dispatch = {} as TheDispatch, mode, onCustomerChange } = this.props;

    return new Promise<string>((resolve, reject) => {
      form.validateFieldsAndScroll(
        [
          'name',
          'mobile',
          'gender',
          'birthday',
          'wechat',
          'job',
          'introducer',
          'integral',
          'contactAddress',
          'note',
        ],
        (err, values) => {
          if (err) {
            reject(err);
          }

          if (mode === 'create') {
            dispatch({
              type: 'customers/addCustomer',
              payload: values,
            })
              .then(customerObj => {
                onCustomerChange && onCustomerChange(customerObj._id);
                return customerObj._id;
              })
              .then((id: string) => {
                resolve(id);
              });
          }

          if (mode === 'update') {
            dispatch({
              type: 'customers/updateCustomer',
              payload: {
                ...values,
                id: this.props.customer,
              },
            });

            resolve('');
          }

          resolve('');
        },
      );
    });
  };

  handleAddOptometryRecord = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }

    // 如果是新增模式，那么需要先保存基本信息
    if (this.props.mode === 'create') {
      Modal.confirm({
        title: '你是否要保存当前客户基本信息?',
        content: '在您添加验光记录前，系统需要保存当前客户的基本信息。',
        okText: '保存',
        cancelText: '取消',

        onOk: () => {
          return this.handleSaveBaseInfo().then((id: string) => {
            // console.log(id, 'id');
            this.toggleAddOptometryDialog();
            // 添加验光记录
          });
        },
      });
    } else {
      this.toggleAddOptometryDialog();
    }
  };

  render() {
    const {
      form,
      mode,
      values = {
        _id: '',
        name: '',
        mobile: '',
        gender: 'unknown',
        birthday: null,
        wechat: '',
        contactAddress: '',
        job: '',
        introducer: '',
        integral: 0,
        note: '',
        lastOptometryInfo: {
          SPH: {
            left: '',
            right: '',
          },
          CYL: {
            left: '',
            right: '',
          },
          axial: {
            left: '',
            right: '',
          },
          PD: {
            left: '',
            right: '',
          },
          totalPD: '',
          CVA: {
            left: '',
            right: '',
          },
          PH: '',
          DominantEye: '',
          BasicVision: {
            left: '',
            right: '',
          },
          NearEye: '',
          FarEye: '',
          NRA: '',
          PRA: '',
          AC_A: '',
          SimultaneousVision: '',
          FusionFunction: '',
          StereoscopicVision: '',
          ADD: {
            left: '',
            right: '',
          },
          optometryNote: '',
          customerID: this.props.customer,
          optometryDate: moment(),
          optometryPerson: '',
        },
      },
    } = this.props;
    const { getFieldDecorator } = form;

    // console.log(values, 'values');
    return (
      <>
        <Drawer
          className={styles.container}
          width={'100%'}
          placement="right"
          closable
          onClose={() => {
            this.handleClose();
          }}
          title={
            <div>
              <Typography.Text>{this.getTitle()}</Typography.Text>
              {mode === 'view' && (
                <Button style={{ marginLeft: '6px' }} size="small" onClick={this.handleToEditMode}>
                  <Icon type="edit" />
                  编辑模式
                </Button>
              )}
              {mode === 'update' && (
                <Button style={{ marginLeft: '6px' }} size="small" onClick={this.handleToViewMode}>
                  <Icon type="eye" />
                  查看模式
                </Button>
              )}
            </div>
          }
          visible={this.props.open}
        >
          <div className={styles.content}>
            <Row gutter={12} style={{ width: '100%' }}>
              <Col span={11} style={{ height: '100%' }}>
                <div className={styles.info}>
                  <div className={styles.card}>
                    <div className={styles.baseInfo}>
                      <Typography.Text className={styles.subTitle}>基本信息</Typography.Text>
                      <Form>
                        <Row gutter={6}>
                          <Col span={6}>
                            <FormItem label="客户名称">
                              {getFieldDecorator('name', {
                                initialValue: dot.pick('name', values),
                                rules: [
                                  {
                                    required: true,
                                    message: formatMessage({ id: 'customer.name.required' }),
                                  },
                                ],
                              })(<Input disabled={mode === 'view'} />)}
                            </FormItem>
                          </Col>
                          <Col span={6}>
                            <FormItem label="手机号(会员卡号)">
                              {getFieldDecorator('mobile', {
                                initialValue: dot.pick('mobile', values),
                                rules: [
                                  {
                                    required: true,
                                    message: formatMessage({ id: 'customer.mobile.required' }),
                                  },
                                ],
                              })(<Input disabled={mode === 'view'} />)}
                            </FormItem>
                          </Col>
                          <Col span={6}>
                            <FormItem label="身份证号">
                              {getFieldDecorator('idcard', {
                                initialValue: dot.pick('idcard', values),
                                rules: [
                                  {
                                    required: true,
                                    message: formatMessage({ id: 'customer.idcard.required' }),
                                  },
                                ],
                              })(<Input disabled={mode === 'view'} />)}
                            </FormItem>
                          </Col>

                          <Col span={6}>
                            <FormItem label="性别">
                              {getFieldDecorator('gender', {
                                initialValue: dot.pick('gender', values),
                                rules: [
                                  {
                                    required: true,
                                    message: formatMessage({ id: 'customer.gender.required' }),
                                  },
                                ],
                                // initialValue: 'unknown',
                              })(
                                <Select disabled={mode === 'view'} placeholder="选择性别">
                                  <Select.Option value="man">男</Select.Option>
                                  <Select.Option value="female">女</Select.Option>
                                  <Select.Option value="unknown">未知</Select.Option>
                                </Select>,
                              )}
                            </FormItem>
                          </Col>
                          <Col span={6}>
                            <FormItem label="生日">
                              {getFieldDecorator('birthday', {
                                initialValue: moment(dot.pick('birthday', values)),
                              })(<DatePicker disabled={mode === 'view'} />)}
                            </FormItem>
                          </Col>
                          <Col span={6}>
                            <FormItem label="微信号">
                              {getFieldDecorator('wechat', {
                                initialValue: dot.pick('wechat', values),
                              })(<Input disabled={mode === 'view'} />)}
                            </FormItem>
                          </Col>
                          <Col span={6}>
                            <FormItem label="工作">
                              {getFieldDecorator('job', {
                                initialValue: dot.pick('job', values),
                              })(<Input disabled={mode === 'view'} />)}
                            </FormItem>
                          </Col>
                          <Col span={6}>
                            <FormItem label="介绍人">
                              {getFieldDecorator('introducer', {
                                initialValue: dot.pick('introducer', values),
                              })(<Input disabled={mode === 'view'} />)}
                            </FormItem>
                          </Col>
                          <Col span={6}>
                            <FormItem label="积分">
                              {getFieldDecorator('integral', {
                                initialValue: dot.pick('integral', values),
                              })(<Input disabled={mode === 'view'} />)}
                            </FormItem>
                          </Col>
                          <Col span={6}>
                            <FormItem label="通信地址">
                              {getFieldDecorator('contactAddress', {
                                initialValue: dot.pick('contactAddress', values),
                              })(<Input disabled={mode === 'view'} />)}
                            </FormItem>
                          </Col>
                          <Col span={24}>
                            <FormItem label="备注">
                              {getFieldDecorator('note', {
                                initialValue: dot.pick('note', values),
                              })(<Input.TextArea disabled={mode === 'view'} />)}
                            </FormItem>
                          </Col>
                        </Row>
                      </Form>
                    </div>
                    <div className={styles.saleInfo}>
                      <Typography.Text className={styles.subTitle}>消费记录</Typography.Text>
                      <Form>
                        <Row gutter={6}>
                          <Col span={6}>
                            <FormItem label="配镜光度(左)">
                              {getFieldDecorator('LuminosityL', {
                                initialValue: dot.pick('LuminosityL', values),
                              })(<Input disabled />)}
                            </FormItem>
                          </Col>
                          <Col span={6}>
                            <FormItem label="配镜光度(右)">
                              {getFieldDecorator('LuminosityR', {
                                initialValue: dot.pick('LuminosityR', values),
                              })(<Input disabled />)}
                            </FormItem>
                          </Col>
                          <Col span={6}>
                            <FormItem label="消费金额">
                              {getFieldDecorator('amount', {
                                initialValue: dot.pick('amount', values),
                              })(<AmountInput disabled />)}
                            </FormItem>
                          </Col>
                          <Col span={24}>
                            <FormItem label="消费商品">
                              {getFieldDecorator('goods', {
                                initialValue: dot.pick('goods', values),
                              })(<Input.TextArea disabled />)}
                            </FormItem>
                          </Col>
                        </Row>
                      </Form>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={13} style={{ height: '100%' }}>
                <div className={styles.info}>
                  <div className={styles.card}>
                    <Typography.Text className={styles.subTitle}>验光信息</Typography.Text>
                    <Form>
                      <Row gutter={6}>
                        <Col span={6}>
                          <FormItem label="球镜(左)">
                            {getFieldDecorator('lastOptometryInfo.SPH.left', {
                              initialValue: dot.pick('lastOptometryInfo.SPH.left', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem label="球镜(右)">
                            {getFieldDecorator('lastOptometryInfo.SPH.right', {
                              initialValue: dot.pick('lastOptometryInfo.SPH.right', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem label="柱镜(左)">
                            {getFieldDecorator('lastOptometryInfo.CYL.left', {
                              initialValue: dot.pick('lastOptometryInfo.CYL.left', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem label="柱镜(右)">
                            {getFieldDecorator('lastOptometryInfo.CYL.right', {
                              initialValue: dot.pick('lastOptometryInfo.CYL.right', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>

                        <Col span={6}>
                          <FormItem label="轴向(左)">
                            {getFieldDecorator('lastOptometryInfo.axial.left', {
                              initialValue: dot.pick('lastOptometryInfo.axial.left', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem label="轴向(右)">
                            {getFieldDecorator('lastOptometryInfo.axial.right', {
                              initialValue: dot.pick('lastOptometryInfo.axial.right', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>

                        <Col span={6}>
                          <FormItem label="矫正视力(左)">
                            {getFieldDecorator('lastOptometryInfo.CVA.left', {
                              initialValue: dot.pick('lastOptometryInfo.CVA.left', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem label="矫正视力(右)">
                            {getFieldDecorator('lastOptometryInfo.CVA.right', {
                              initialValue: dot.pick('lastOptometryInfo.CVA.right', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>

                        <Col span={6}>
                          <FormItem label="瞳距(左)">
                            {getFieldDecorator('lastOptometryInfo.PD.left', {
                              initialValue: dot.pick('lastOptometryInfo.PD.left', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem label="瞳距(右)">
                            {getFieldDecorator('lastOptometryInfo.PD.right', {
                              initialValue: dot.pick('lastOptometryInfo.PD.right', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem label="总瞳距">
                            {getFieldDecorator('lastOptometryInfo.totalPD', {
                              initialValue: dot.pick('lastOptometryInfo.totalPD', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>

                        <Col span={6}>
                          <FormItem label="下加光[ADD] (左)">
                            {getFieldDecorator('lastOptometryInfo.ADD.left', {
                              initialValue: dot.pick('lastOptometryInfo.ADD.left', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem label="下加光[ADD] (右)">
                            {getFieldDecorator('lastOptometryInfo.ADD.right', {
                              initialValue: dot.pick('lastOptometryInfo.ADD.right', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>

                        <Col span={6}>
                          <FormItem label="瞳高">
                            {getFieldDecorator('lastOptometryInfo.PH', {
                              initialValue: dot.pick('lastOptometryInfo.PH', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>

                        <Col span={6}>
                          <FormItem label="主视眼">
                            {getFieldDecorator('lastOptometryInfo.DominantEye', {
                              initialValue: dot.pick('lastOptometryInfo.DominantEye', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>

                        <Col span={6}>
                          <FormItem label="远用眼位">
                            {getFieldDecorator('lastOptometryInfo.FarEye', {
                              initialValue: dot.pick('lastOptometryInfo.FarEye', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>

                        <Col span={6}>
                          <FormItem label="近用眼位">
                            {getFieldDecorator('lastOptometryInfo.NearEye', {
                              initialValue: dot.pick('lastOptometryInfo.NearEye', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>

                        <Col span={6}>
                          <FormItem label="NRA">
                            {getFieldDecorator('lastOptometryInfo.NRA', {
                              initialValue: dot.pick('lastOptometryInfo.NRA', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>

                        <Col span={6}>
                          <FormItem label="PRA">
                            {getFieldDecorator('lastOptometryInfo.PRA', {
                              initialValue: dot.pick('lastOptometryInfo.PRA', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>

                        <Col span={6}>
                          <FormItem label="AC/A值">
                            {getFieldDecorator('lastOptometryInfo.AC_A', {
                              initialValue: dot.pick('lastOptometryInfo.AC_A', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>

                        <Col span={6}>
                          <FormItem label="同时视">
                            {getFieldDecorator('lastOptometryInfo.SimultaneousVision', {
                              initialValue: dot.pick(
                                'lastOptometryInfo.SimultaneousVision',
                                values,
                              ),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>

                        <Col span={6}>
                          <FormItem label="融合视">
                            {getFieldDecorator('lastOptometryInfo.FusionFunction', {
                              initialValue: dot.pick('lastOptometryInfo.FusionFunction', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>

                        <Col span={6}>
                          <FormItem label="立体视">
                            {getFieldDecorator('lastOptometryInfo.StereoscopicVision', {
                              initialValue: dot.pick(
                                'lastOptometryInfo.StereoscopicVision',
                                values,
                              ),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>

                        <Col span={6}>
                          <FormItem label="裸眼视力(左)">
                            {getFieldDecorator('lastOptometryInfo.BasicVision.left', {
                              initialValue: dot.pick('lastOptometryInfo.BasicVision.left', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>

                        <Col span={6}>
                          <FormItem label="裸眼视力(右)">
                            {getFieldDecorator('lastOptometryInfo.BasicVision.right', {
                              initialValue: dot.pick('lastOptometryInfo.BasicVision.right', values),
                            })(<Input disabled />)}
                          </FormItem>
                        </Col>

                        <Col span={24}>
                          <FormItem label="备注">
                            {getFieldDecorator('lastOptometryInfo.optometryNote', {
                              initialValue: dot.pick('lastOptometryInfo.optometryNote', values),
                            })(<Input.TextArea disabled />)}
                          </FormItem>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className={styles.footer}>
            <Button onClick={this.handleAddOptometryRecord} disabled={mode === 'view'}>
              <Icon type="plus" />
              验光记录
            </Button>
            <Popover
              title="验光记录"
              trigger="click"
              visible={this.state.viewOptometryRecord}
              onVisibleChange={(visible: boolean) => {
                this.setState({
                  viewOptometryRecord: visible,
                });
              }}
              content={
                <OptometryRecord
                  customer={this.props.customer}
                  onRecordSelect={record => {
                    const values = form.getFieldsValue();
                    const { onValueChange } = this.props;
                    onValueChange &&
                      onValueChange({
                        ...values,
                        lastOptometryInfo: record,
                      });
                  }}
                />
              }
            >
              <Button>
                <Icon type="unordered-list" />
                验光记录
              </Button>
            </Popover>
            <Button>消费记录</Button>
            <Button disabled={mode === 'view'} type="primary" onClick={this.handleSaveBaseInfo}>
              保存基本信息
            </Button>
            <Button type="danger" onClick={this.handleClose}>
              关闭
            </Button>
          </div>
        </Drawer>

        <AddOptometryRecord
          open={this.state.openAddOptometryDialog}
          customer={this.props.customer}
          toggleOpenState={state => {
            this.setState({
              openAddOptometryDialog: state,
            });
          }}
          onLastOptometryChange={optometryInfo => {
            const { form } = this.props;

            const values = form.getFieldsValue();
            const { onValueChange } = this.props;
            onValueChange &&
              onValueChange({
                ...values,
                lastOptometryInfo: optometryInfo,
              });

            // const values = form.getFieldsValue();
            // const optometry = lodash.pick(optometryInfo, [
            //   'SPH', 'CYL', 'axial', 'CVA', 'PD', 'totalPD', 'ADD',
            //   'PH', 'DominantEye', 'FarEye', 'NearEye',
            //   'NRA', 'PRA', 'AC_A', 'SimultaneousVision', 'FusionFunction',
            //   'StereoscopicVision', 'BasicVision', 'optometryNote'
            // ]);

            // console.log(optometry);

            // form.resetFields();
            // form.setFieldsValue({
            //   ...values,
            //   lastOptometryInfo: optometry,
            // });
          }}
        />
      </>
    );
  }
}

export default Form.create<EditCustomerViewProps>()(EditCustomer);
