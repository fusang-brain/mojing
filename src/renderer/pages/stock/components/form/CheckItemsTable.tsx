import React, { PureComponent } from 'react';
import { ConnectState, TheDispatch, BaseProps } from '@/models/connect';
import moment from 'moment';
import { Tag, Empty, Button, Modal, Typography, Form, Row, Col, InputNumber } from 'antd';
import { ColumnProps } from '@/components/DataTable/interface';
import { connect } from 'dva';
import styles from './styles.less';
import DataTable from '@/components/DataTable';
import { FormComponentProps } from 'antd/es/form';

export interface ICheckItemsTableProps extends BaseProps, FormComponentProps {
  instock?: ConnectState['instock'];
  outstock?: ConnectState['outstock'];
  kind: 'instock' | 'outstock';
  nextStep?: (order: any) => void;
  prevStep?: (state: string) => void;
}

interface ICheckItemsTableState {
  checkModelVisible?: boolean;
  currentItem?: any;
}

const FormItem = Form.Item;

@connect((s: ConnectState) => ({
  instock: s.instock,
  outstock: s.outstock,
}))
class CheckItemsTable extends PureComponent<ICheckItemsTableProps, ICheckItemsTableState> {
  state = {
    checkModelVisible: false,
    currentItem: {} as any,
  };

  get columns(): ColumnProps<any>[] {
    return [
      {
        title: '商品名称',
        dataIndex: 'productName',
        width: 200,
        render(txt: string, record: any) {
          if (txt) {
            return <span>{txt}</span>;
          }
          const { productInfo = {} } = record;
          return <span>{productInfo.name || '--'}</span>;
        },
      },
      {
        title: '商品批号',
        dataIndex: 'productBatchNumber',
        width: 200,
        render(txt: string, record: any) {
          if (txt) {
            return <span>{txt}</span>;
          }
          const { productBatchInfo = {} } = record;
          if (!productBatchInfo) {
            return <span>--</span>;
          }
          return <span>{productBatchInfo.batchNumber || '--'}</span>;
        },
      },
      {
        title: '规格',
        width: 280,
        dataIndex: 'guige',
      },
      {
        title: '失效日期',
        dataIndex: 'sxrq',
        width: 150,
        render(txt: string, record: any) {
          const { productBatchInfo = {} } = record;
          if (!productBatchInfo) {
            return <span>--</span>;
          }
          if (!productBatchInfo.expirationDate) {
            return <span>--</span>;
          }
          return <span>{moment(productBatchInfo.expirationDate).format('YYYY-MM-DD')}</span>;
        },
      },
      {
        title: '数量',
        width: 100,
        dataIndex: 'total',
      },
      {
        title: '验收日期',
        dataIndex: 'checkDate',
        width: 150,
        render: (val: string) => {
          if (!val) {
            return <span>--</span>;
          }

          return <span>{moment(val).format('YYYY-MM-DD')}</span>;
        },
      },
      {
        title: '验收合格数',
        width: 100,
        dataIndex: 'checkQualifiedCount',
      },
      {
        title: '验收结果',
        dataIndex: 'checkResult',
        render(val: string, record: any) {
          if (!val) {
            return <Tag>未验收</Tag>;
          }

          if (val === 'checked') {
            return <Tag>已验收</Tag>;
          }

          return <Tag>未验收</Tag>;
        },
      },
      {
        title: '操作',
        align: 'left',
        width: 160,
        dataIndex: 'action',
        render: (txt: string, record: any) => {
          const isCheckBtnDisabled = record.checkResult === 'checked';
          return (
            <div>
              <Button
                size="small"
                disabled={isCheckBtnDisabled}
                onClick={this.handleOpenCheckModal(record)}
              >
                验收
              </Button>

              {/* <Button variant="contained" color="primary" disabled={isCheckBtnDisabled} onClick={this.handleOpenCheckModal(record)}>验收</Button>
              <Button variant="outlined" style={{ marginLeft: '5px' }} color="secondary">删除</Button> */}
            </div>
          );
        },
      },
    ];
  }

  toggleCheckModalVisible = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }

    this.setState({
      checkModelVisible: !this.state.checkModelVisible,
    });
  };

  handleOpenCheckModal = (record?: any) => (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }

    this.setState({
      currentItem: record,
    });

    this.toggleCheckModalVisible();
  };

  handleCheckOneItem = () => {
    // if (e) {
    //   e.preventDefault();
    // }

    const { currentItem } = this.state;

    const { dispatch = {} as TheDispatch, kind, form } = this.props;

    return new Promise((resolve, reject) => {
      form.validateFieldsAndScroll((err, values) => {
        if (err) {
          reject(err);
          return;
        }
        // actions.setSubmitting(false);
        dispatch({
          type: `${kind}/checkOneOrderItem`,
          payload: {
            itemID: currentItem._id,
            orderID: currentItem.orderID,
            ...values,
          },
        })
          .then(() => {
            resolve(true);
            form.resetFields(['checkQualifiedCount']);
            this.toggleCheckModalVisible();
          })
          .catch(err => {
            reject(err);
          });
      });
    });
  };

  get isChecked() {
    const stockOrder = this.props[this.props.kind];

    if (!stockOrder) {
      return false;
    }
    const { currentItems = [] } = stockOrder;

    for (const item of currentItems) {
      if (item.checkResult !== 'checked') {
        return false;
      }
    }

    return true;
  }

  handleCheckedAll = (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }

    const { dispatch = {} as TheDispatch } = this.props;

    dispatch({
      type: `${this.props.kind}/checkedAll`,
    });
  };

  render() {
    const stockModel = this.props[this.props.kind];
    if (!stockModel) {
      return <Empty />;
    }
    const { currentItem } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <>
        <div className={styles.checkItemsTable}>
          <div className={styles.body}>
            <div className={styles.content}>
              <DataTable
                columns={this.columns}
                disableToolbar
                showPagination={false}
                fixedColumnsRight={['action']}
                fixedColumnsLeft={['productName', 'productBatchNumber']}
                rows={stockModel.currentItems || []}
              />
            </div>
          </div>
          <div className={styles.footer}>
            {/* <Button 
            style={{ marginRight: '12px' }}
            onClick={() => {
              if (this.props.prevStep) {
                this.props.prevStep('checkItems');
              }
            }}
          >上一步</Button> */}
            <Button
              type="primary"
              onClick={() => {
                if (this.props.nextStep) {
                  this.props.nextStep(stockModel.currentOrder);
                }
              }}
            >
              下一步
            </Button>
          </div>
        </div>
        <Modal
          visible={this.state.checkModelVisible}
          onCancel={() => {
            form.resetFields();
            this.toggleCheckModalVisible();
          }}
          title={<Typography.Text>验收中...</Typography.Text>}
          onOk={this.handleCheckOneItem}
        >
          <Form>
            <Row gutter={12}>
              <Col span={12}>
                <FormItem label="总数">
                  {getFieldDecorator('total', {
                    initialValue: currentItem.total,
                  })(<InputNumber disabled />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="合格数">
                  {getFieldDecorator('checkQualifiedCount', {
                    initialValue: currentItem.total || 0,
                  })(<InputNumber max={currentItem.total} />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create<ICheckItemsTableProps>()(CheckItemsTable);
