import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './styles.less';
import { ProductList } from '@/components/ProductList';
import {
  Form,
  Typography,
  Modal,
  Row,
  Col,
  InputNumber,
  Button,
  Select,
  Input,
  message,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import DataTable from '@/components/DataTable';
import { ColumnProps } from '@/components/DataTable/interface';
import SelectCustomer from '@/components/Selector/SelectCustomer';
import { findProductInfo } from '@/services/product';
import { AxiosResponse } from 'axios';
import { NetworkError } from '@/components/Exception/utils';
import lodash from 'lodash';
import moment from 'moment';
import { TheDispatch, BaseProps } from '@/models/connect';
import { connect } from 'dva';

interface AddSaleViewProps extends FormComponentProps, BaseProps {}

interface AddSaleViewState {
  products?: Array<any>;
  openAddOneDialog?: boolean;
  loadingProductInfo?: boolean;
  selectedProduct?: any;
  selectedBatchInfo?: any;
  paidType?: number; // 支付类型
  arrears?: number; // 欠款数量
  amount?: number; // 金额
  openSaleConfirm?: boolean;
}

@connect()
class AddSaleView extends PureComponent<AddSaleViewProps, AddSaleViewState> {
  state: AddSaleViewState = {
    products: [],
    openAddOneDialog: false,
    loadingProductInfo: false,
    selectedProduct: {
      unitPurchasePrice: 0,
    },
    selectedBatchInfo: {},
    openSaleConfirm: false,
  };

  customer: any = {};

  get columnConfig(): ColumnProps<any>[] {
    return [
      {
        title: '商品编号',
        width: 120,
        align: 'right',
        dataIndex: 'productCode',
      },
      {
        title: '商品批次',
        width: 120,
        align: 'left',
        dataIndex: 'productBatchNumber',
      },
      {
        title: '商品名称',
        width: 150,
        dataIndex: 'productName',
      },
      {
        title: '商品数量',
        width: 100,
        dataIndex: 'total',
      },
      {
        title: '商品金额',
        width: 100,
        dataIndex: 'amount',
        render: (_: any, record: any) => {
          const { price = 0, total = 0 } = record;
          return `¥ ${price * total}`;
        },
      },
      {
        title: '操作',
        width: 150,
        dataIndex: 'actions',
        align: 'right',
        render: (_: any, record: any) => {
          console.log(record);
          return (
            <>
              {/* <Tooltip title="添加数量">
              <IconButton onClick={this.handleAddCount(record)}>
                <Add />
              </IconButton>
            </Tooltip>

            <Tooltip title="减少数量">
              <IconButton onClick={this.handleRemoveCount(record)}>
                <Remove />
              </IconButton>
            </Tooltip>
            
            <IconButton color="secondary" onClick={this.handleDeleteCount}>
              <Delete />
            </IconButton> */}
            </>
          );
        },
      },
    ];
  }

  openAddOneDialog = () => {
    this.setState({
      openAddOneDialog: true,
    });
  };

  openConfirmSaleDialog = () => {
    this.setState({
      openSaleConfirm: true,
    });
  };

  handleOpenAddOneDialog = (record: any) => {
    this.setState(
      {
        loadingProductInfo: true,
        // openAddOneDialog: true,
      },
      () => {
        this.openAddOneDialog();
      },
    );

    findProductInfo(record._id)
      .then((resp: AxiosResponse) => {
        const { data } = resp;
        // console.log(data.info);
        this.setState(
          {
            selectedProduct: data.info,
          },
          () => {
            this.setState({
              loadingProductInfo: false,
            });
          },
        );
      })
      .catch(() => {
        NetworkError();
        this.closeAddOneDialog();
        this.setState({
          loadingProductInfo: false,
        });
      });
  };

  handleAddOne = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll(['total', 'price'], (err, value) => {
      if (err) return;
      const { products = [], selectedProduct = {}, selectedBatchInfo = {} } = this.state;
      const product = {
        productCode: selectedProduct.code,
        productID: selectedProduct._id,
        productName: selectedProduct.name,
        productBatchID: selectedBatchInfo._id,
        productBatchNumber: selectedBatchInfo.batchNumber,
        total: value.total,
        price: value.price,
      };
      const { total, ...restPayload } = product;

      const foundIndex = lodash.findIndex(products, restPayload);

      if (foundIndex >= 0) {
        products[foundIndex].total = products[foundIndex].total + total;
      } else {
        products.push(product);
      }

      this.setState({
        products: products,
      });
      form.resetFields(['total']);
      this.closeAddOneDialog();
      this.clearSelectedBatchInfo();
    });
  };

  clearSelectedBatchInfo = () => {
    this.setState({
      selectedBatchInfo: {},
    });
  };

  closeConfirmSaleDialog = () => {
    this.setState({
      openSaleConfirm: false,
    });
  };

  get totalAmount(): number {
    const { products = [] } = this.state;

    let amount = 0;
    for (const product of products) {
      const { price = 0, total = 0 } = product || {};
      amount += price * total;
    }

    return amount;
  }

  closeAddOneDialog = () => {
    this.setState({
      openAddOneDialog: false,
    });
  };

  startSale = () => {
    const { form } = this.props;
    const { products = [] } = this.state;

    form.validateFieldsAndScroll(['customer'], (err, values) => {
      if (err) return;
      if (products.length <= 0) {
        message.warning('请至少选择一个商品');
        return;
      }
      this.customer = values.customer;
      this.openConfirmSaleDialog();
    });
  };

  handleSubmit = () => {
    const { form, dispatch = {} as TheDispatch } = this.props;
    form.validateFieldsAndScroll(['customer', 'paidType', 'amount', 'advance'], (err, values) => {
      if (err) return;
      const customer = values.customer;
      const { products = [] } = this.state;

      const paidDate = moment().toISOString();

      const arrears = values.paidType !== 5 ? 0 : values.amount - values.advance;

      const submitValues = {
        customer: customer.key || '',

        products: products.map(_ => _.productID),

        productsCount: products.map(_ => ({
          id: _.productID,
          count: +_.total,
        })),

        amount: values.amount,
        saleDate: paidDate,
        state: arrears === 0 ? 2 : 3,
        paidType: values.paidType,
        arrears: arrears,
        paidRecords: [
          {
            date: paidDate,
            amount: values.paidType !== 5 ? values.amount : values.advance,
          },
        ],
      };

      dispatch({
        type: 'sale/createSale',
        payload: submitValues,
      });

      form.resetFields(['customer']);
      this.setState({
        products: [],
      });
      this.closeConfirmSaleDialog();
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    const { selectedProduct } = this.state;

    const formItemLayout = {
      // labelCol: { span: 4 },
      wrapperCol: { span: 10 },
    };

    return (
      <>
        <PageHeaderWrapper title="销售记录">
          <div className={styles.container}>
            <div className={styles.pane}>
              <div className={styles.mainPane}>
                <div className={styles.title}>
                  <Typography.Title level={4}>购物信息</Typography.Title>
                </div>
                <div className={styles.form}>
                  <Form {...formItemLayout} style={{ width: '100%' }}>
                    <Form.Item>
                      {getFieldDecorator('customer', {
                        rules: [
                          {
                            required: true,
                            message: '请选择一个会员',
                          },
                        ],
                      })(<SelectCustomer placeholder="选择会员" />)}
                    </Form.Item>
                  </Form>
                </div>
                <div className={styles.content}>
                  <DataTable
                    title="已购商品"
                    disableToolbar
                    columns={this.columnConfig}
                    fixedColumnsLeft={['productCode']}
                    fixedColumnsRight={['actions']}
                    rows={this.state.products}
                  />
                </div>
              </div>
              <div className={styles.productListPane}>
                <ProductList onAddOne={this.handleOpenAddOneDialog} />
              </div>
            </div>
            <div className={styles.footer}>
              <div className={styles.left}>
                <Typography.Text>总金额: ¥ {this.totalAmount}</Typography.Text>
              </div>

              <div className={styles.right}>
                <Button onClick={this.startSale}>结账</Button>
              </div>
            </div>
          </div>
        </PageHeaderWrapper>

        <Modal
          title={<Typography.Text>确认销售信息</Typography.Text>}
          visible={this.state.openSaleConfirm}
          onCancel={this.closeConfirmSaleDialog}
          onOk={this.handleSubmit}
        >
          <Form name="confirm-sale">
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="支付方式">
                  {getFieldDecorator('paidType', {
                    rules: [
                      {
                        required: true,
                        message: '请选择支付类型',
                      },
                    ],
                  })(
                    <Select>
                      <Select.Option key={0} value={1}>
                        现金
                      </Select.Option>
                      <Select.Option key={1} value={2}>
                        支付宝
                      </Select.Option>
                      <Select.Option key={2} value={3}>
                        微信
                      </Select.Option>
                      <Select.Option key={3} value={4}>
                        银联
                      </Select.Option>
                      <Select.Option key={4} value={5}>
                        其他
                      </Select.Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="成交金额">
                  {getFieldDecorator('amount')(<InputNumber />)}
                </Form.Item>
              </Col>
              {form.getFieldValue('paidType') === 5 ? (
                <Col span={12}>
                  <Form.Item label="预付款">
                    {getFieldDecorator('advance')(<InputNumber />)}
                  </Form.Item>
                </Col>
              ) : null}
            </Row>
          </Form>
        </Modal>

        <Modal
          visible={this.state.openAddOneDialog}
          title={<Typography.Text>添加商品</Typography.Text>}
          onCancel={this.closeAddOneDialog}
          okText="添加"
          cancelText="取消"
          onOk={this.handleAddOne}
        >
          <Form>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="金额">
                  {getFieldDecorator('price', {
                    initialValue: selectedProduct.unitPurchasePrice,
                  })(<InputNumber disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="总数">
                  {getFieldDecorator('total', {
                    rules: [
                      {
                        required: true,
                        message: '请填写商品数量',
                      },
                    ],
                  })(<InputNumber />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create<AddSaleViewProps>()(AddSaleView);
