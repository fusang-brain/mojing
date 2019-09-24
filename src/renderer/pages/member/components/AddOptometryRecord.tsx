import React, { PureComponent } from 'react';
import { BaseProps, TheDispatch, ConnectState } from '@/models/connect';
import { Modal, Form, Row, Input, Col, Button, DatePicker, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';

interface AddOptometryRecordProps extends BaseProps, FormComponentProps {
  customer?: string;
  idCard?: string;
  open?: boolean;
  operators?: ConnectState['global']['operators'];
  toggleOpenState?: (state: boolean) => void;
  onLastOptometryChange?: (lastOptometry?: any) => void;
}

interface AddOptometryRecordState {
  createModalVisible?: boolean;
}

const FormItem = Form.Item;

@connect((s: ConnectState) => ({
  operators: s.global.operators,
  loading: s.loading,
}))
class AddOptometryRecord extends PureComponent<AddOptometryRecordProps, AddOptometryRecordState> {
  state: AddOptometryRecordState = {
    createModalVisible: false,
  };

  handleSave = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const {
      dispatch = {} as TheDispatch,
      customer,
      idCard,
      onLastOptometryChange,
      form,
    } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      dispatch({
        type: 'optometry/addOptometry',
        payload: {
          ...values,
          customerID: customer,
          idCard,
        },
      }).then(optometry => {
        this.toggleCreateModal();
        if (onLastOptometryChange) {
          onLastOptometryChange(optometry);
        }
      });
    });
  };

  toggleCreateModal = () => {
    // this.setState({
    //   createModalVisible: !this.state.createModalVisible,
    // });
    const { toggleOpenState } = this.props;
    if (toggleOpenState) {
      toggleOpenState(!this.props.open);
    }
  };

  render() {
    const { form, operators = [], loading = {} as ConnectState['loading'] } = this.props;
    const { getFieldDecorator } = form;
    return (
      <>
        <Modal
          centered
          width={850}
          visible={this.props.open}
          onCancel={this.toggleCreateModal}
          footer={
            <div>
              <Button onClick={this.toggleCreateModal}>取消</Button>
              <Button
                type="primary"
                loading={loading.effects['optometry/addOptometry']}
                onClick={this.handleSave}
              >
                提交
              </Button>
            </div>
          }
        >
          <Form>
            <Row gutter={6}>
              <Col span={4}>
                <FormItem label="验光日期">
                  {getFieldDecorator('optometryDate')(<DatePicker />)}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="验光师">
                  {getFieldDecorator('optometryPerson')(
                    <Select>
                      {operators.map((operator: any) => (
                        <Select.Option key={operator._id} value={operator._id}>
                          {operator.realname}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="球镜(左)">{getFieldDecorator('SPH.left')(<Input />)}</FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="球镜(右)">{getFieldDecorator('SPH.right')(<Input />)}</FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="柱镜(左)">{getFieldDecorator('CYL.left')(<Input />)}</FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="柱镜(右)">{getFieldDecorator('CYL.right')(<Input />)}</FormItem>
              </Col>

              <Col span={4}>
                <FormItem label="轴向(左)">{getFieldDecorator('axial.left')(<Input />)}</FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="轴向(右)">{getFieldDecorator('axial.right')(<Input />)}</FormItem>
              </Col>

              <Col span={4}>
                <FormItem label="矫正视力(左)">{getFieldDecorator('CVA.left')(<Input />)}</FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="矫正视力(右)">
                  {getFieldDecorator('CVA.right')(<Input />)}
                </FormItem>
              </Col>

              <Col span={4}>
                <FormItem label="瞳距(左)">{getFieldDecorator('PD.left')(<Input />)}</FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="瞳距(右)">{getFieldDecorator('PD.right')(<Input />)}</FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="总瞳距">{getFieldDecorator('totalPD')(<Input />)}</FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="下加光[ADD] (左)">
                  {getFieldDecorator('ADD.left')(<Input />)}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="下加光[ADD] (右)">
                  {getFieldDecorator('ADD.right')(<Input />)}
                </FormItem>
              </Col>

              <Col span={4}>
                <FormItem label="瞳高">{getFieldDecorator('PH')(<Input />)}</FormItem>
              </Col>

              <Col span={4}>
                <FormItem label="主视眼">{getFieldDecorator('DominantEye')(<Input />)}</FormItem>
              </Col>

              <Col span={4}>
                <FormItem label="远用眼位">{getFieldDecorator('FarEye')(<Input />)}</FormItem>
              </Col>

              <Col span={4}>
                <FormItem label="近用眼位">{getFieldDecorator('NearEye')(<Input />)}</FormItem>
              </Col>

              <Col span={4}>
                <FormItem label="NRA">{getFieldDecorator('NRA')(<Input />)}</FormItem>
              </Col>

              <Col span={4}>
                <FormItem label="PRA">{getFieldDecorator('PRA')(<Input />)}</FormItem>
              </Col>

              <Col span={4}>
                <FormItem label="AC/A值">{getFieldDecorator('AC_A')(<Input />)}</FormItem>
              </Col>

              <Col span={4}>
                <FormItem label="同时视">
                  {getFieldDecorator('SimultaneousVision')(<Input />)}
                </FormItem>
              </Col>

              <Col span={4}>
                <FormItem label="融合视">{getFieldDecorator('FusionFunction')(<Input />)}</FormItem>
              </Col>

              <Col span={4}>
                <FormItem label="立体视">
                  {getFieldDecorator('StereoscopicVision')(<Input />)}
                </FormItem>
              </Col>

              <Col span={4}>
                <FormItem label="裸眼视力(左)">
                  {getFieldDecorator('BasicVision.left')(<Input />)}
                </FormItem>
              </Col>

              <Col span={4}>
                <FormItem label="裸眼视力(右)">
                  {getFieldDecorator('BasicVision.right')(<Input />)}
                </FormItem>
              </Col>

              <Col span={24}>
                <FormItem label="备注">
                  {getFieldDecorator('optometryNote')(<Input.TextArea />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create<AddOptometryRecordProps>()(AddOptometryRecord);
