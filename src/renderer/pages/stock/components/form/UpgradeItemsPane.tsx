import React, { PureComponent } from 'react';
import styles from './styles.less';
import { ProductList } from '@/components/ProductList';
import { ConnectState, BaseProps, TheDispatch } from '@/models/connect';
import { ColumnProps } from '@/components/DataTable/interface';
import DataTable from '@/components/DataTable';
import {
  Typography,
  Modal,
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Icon,
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { AmountInput } from '@/components/DataEntry';
import NumberInfo from 'ant-design-pro/lib/NumberInfo';
import numeral from 'numeral';
import SelectProductBatch from '@/components/Selector/SelectProductBatch';
import moment from 'moment';

interface UpgradeItemsPaneProps extends FormComponentProps, BaseProps {
  kind: 'instock' | 'outstock';
  instock?: ConnectState['instock'];
  outstock?: ConnectState['outstock'];
  checked?: any[];
  prevStep?: (state?: string) => void;
  nextStep?: (values?: any) => void;
  submiting?: boolean;
}

interface UpgradeItemsState {
  showSelectPane?: boolean;
  selectedBatchInfo?: any;
  loadingProductInfo?: boolean;
  // openFilter?:
}

const FormItem = Form.Item;

@connect((s: ConnectState) => ({
  loading: s.loading,
  instock: s.instock,
  outstock: s.outstock,
}))
class UpgradeItemsPane extends PureComponent<UpgradeItemsPaneProps, UpgradeItemsState> {
  state: UpgradeItemsState = {
    showSelectPane: false,
    selectedBatchInfo: [],
    loadingProductInfo: false,
  };

  toggleShowSelectPane = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      showSelectPane: !this.state.showSelectPane,
    });
  };

  handleToggleShowAddStock = (record: any) => {
    // const { kind, category } = record;

    const { dispatch = {} as TheDispatch } = this.props;
    // LOADINGG
    // this.setState({
    //   loadingProductInfo: true,
    // });
    this.toggleShowSelectPane();
    dispatch({
      type: `${this.props.kind}/loadProductInfo`,
      payload: {
        id: record._id,
      },
    });
  };

  get columnsConfig(): ColumnProps<any>[] {
    return [
      {
        title: '商品名称',
        dataIndex: 'productName',
        width: 200,
      },
      {
        title: '商品批号',
        dataIndex: 'productBatchNumber',
        width: 200,
      },
      {
        title: '到货数量',
        dataIndex: 'total',
      },
      {
        title: '操作',
        dataIndex: 'action',
        align: 'right',
        width: 100,
        render: (txt, record) => {
          return (
            <Button onClick={this.handleDeleteOne(record)}>
              <Icon type="delete" />
            </Button>
          );
        },
      },
    ];
  }

  /**
   * 删除一项
   */
  handleDeleteOne = (record: any) => () => {
    const { dispatch = {} as TheDispatch, kind } = this.props;

    dispatch({
      type: `${kind}/deleteStockOrderItem`,
      payload: {
        id: record._id,
        orderID: record.orderID,
      },
    });
  };

  /**
   * 渲染隐形眼镜详情
   */
  renderContactLensesProductDetails = () => {
    const {
      instock = {} as ConnectState['instock'],
      outstock = {} as ConnectState['outstock'],
      kind,
      form,
    } = this.props;
    const { getFieldDecorator, setFieldsValue } = form;
    const { selectedItem = {} } = kind === 'instock' ? instock : outstock;

    return (
      <>
        <Row gutter={6}>
          <Col span={8}>
            <FormItem label="批号">
              {getFieldDecorator('productBatch', {
                initialValue: selectedItem.productBatch,
              })(
                <SelectProductBatch
                  productID={selectedItem._id}
                  onSelectOne={(selectedBatchInfo, value) => {
                    this.setState({
                      selectedBatchInfo,
                    });
                    setFieldsValue({
                      startDate: moment(selectedBatchInfo.startDate || ''),
                      expirationDate: moment(selectedBatchInfo.expirationDate || ''),
                      color: selectedBatchInfo.color || '',
                      diopter: selectedBatchInfo.diopter || '',
                      BOZR: selectedBatchInfo.BOZR || '',
                      diameter: selectedBatchInfo.diameter || '',
                    });
                  }}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="商品名称">
              {getFieldDecorator('name', {
                initialValue: selectedItem.name,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="品牌">
              {getFieldDecorator('brand', {
                initialValue: selectedItem.brand,
              })(<Input disabled />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="颜色">
              {getFieldDecorator('color', {
                initialValue: selectedItem.colorNumber,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="度数">
              {getFieldDecorator('diopter', {
                initialValue: selectedItem.frameHeight,
              })(<Input disabled />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="基弧">
              {getFieldDecorator('BOZR', {
                initialValue: selectedItem.frameWidth,
              })(<Input disabled />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="直径">
              {getFieldDecorator('diameter', {
                initialValue: selectedItem.frameHeight,
              })(<Input disabled />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="生产日期">
              {getFieldDecorator('startDate', {
                initialValue: selectedItem.noseBridgeWeight,
              })(<DatePicker />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="失效日期">
              {getFieldDecorator('expirationDate', {
                initialValue: selectedItem.frameLegLength,
              })(<DatePicker />)}
            </FormItem>
          </Col>
        </Row>
      </>
    );
  };

  /**
   * 显示镜框详情
   */
  renderGlassesFrameProductDetails = () => {
    const {
      instock = {} as ConnectState['instock'],
      outstock = {} as ConnectState['outstock'],
      kind,
      form,
    } = this.props;
    const { getFieldDecorator } = form;
    const { selectedItem = {} } = kind === 'instock' ? instock : outstock;

    return (
      <>
        <Row gutter={6}>
          <Col span={8}>
            <FormItem label="批号">
              {getFieldDecorator('productBatch', {
                initialValue: selectedItem.productBatch,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="商品名称">
              {getFieldDecorator('name', {
                initialValue: selectedItem.name,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="品牌">
              {getFieldDecorator('brand', {
                initialValue: selectedItem.brand,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="型号">
              {getFieldDecorator('typeSpecification', {
                initialValue: selectedItem.typeSpecification,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="色号">
              {getFieldDecorator('colorNumber', {
                initialValue: selectedItem.colorNumber,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="架面高度">
              {getFieldDecorator('frameHeight', {
                initialValue: selectedItem.frameHeight,
              })(<Input disabled />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="架面宽度">
              {getFieldDecorator('frameWidth', {
                initialValue: selectedItem.frameWidth,
              })(<Input disabled />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="架面高度">
              {getFieldDecorator('frameHeight', {
                initialValue: selectedItem.frameHeight,
              })(<Input disabled />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="鼻梁宽度">
              {getFieldDecorator('noseBridgeWeight', {
                initialValue: selectedItem.noseBridgeWeight,
              })(<Input disabled />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="镜腿长">
              {getFieldDecorator('frameLegLength', {
                initialValue: selectedItem.frameLegLength,
              })(<Input disabled />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="镜架重量">
              {getFieldDecorator('frameWeight', {
                initialValue: selectedItem.frameWeight,
              })(<Input disabled />)}
            </FormItem>
          </Col>
        </Row>
      </>
    );
  };

  /**
   * 渲染老花镜详情
   */
  renderPresbyopicGlassesDetails = () => {
    const {
      instock = {} as ConnectState['instock'],
      outstock = {} as ConnectState['outstock'],
      kind,
      form,
    } = this.props;
    const { getFieldDecorator } = form;
    const { selectedItem = {} } = kind === 'instock' ? instock : outstock;

    return (
      <>
        <Row gutter={6}>
          <Col span={8}>
            <FormItem label="批号">
              {getFieldDecorator('productBatch', {
                initialValue: selectedItem.productBatch,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="商品名称">
              {getFieldDecorator('name', {
                initialValue: selectedItem.name,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="品牌">
              {getFieldDecorator('brand', {
                initialValue: selectedItem.brand,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="型号">
              {getFieldDecorator('typeSpecification', {
                initialValue: selectedItem.typeSpecification,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="色号">
              {getFieldDecorator('colorNumber', {
                initialValue: selectedItem.colorNumber,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="度数">
              {getFieldDecorator('diopter', {
                initialValue: selectedItem.diopter,
              })(<Input disabled />)}
            </FormItem>
          </Col>
        </Row>
      </>
    );
  };

  /**
   * 渲染镜片详情
   */
  renderEyeGlassProductDetails = () => {
    const {
      instock = {} as ConnectState['instock'],
      outstock = {} as ConnectState['outstock'],
      kind,
      form,
    } = this.props;
    const { getFieldDecorator } = form;
    const { selectedItem = {} } = kind === 'instock' ? instock : outstock;

    return (
      <>
        <Row gutter={6}>
          <Col span={8}>
            <FormItem label="批号">
              {getFieldDecorator('productBatch', {
                initialValue: selectedItem.productBatch,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="商品名称">
              {getFieldDecorator('name', {
                initialValue: selectedItem.name,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="品牌">
              {getFieldDecorator('brand', {
                initialValue: selectedItem.brand,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="型号">
              {getFieldDecorator('typeSpecification', {
                initialValue: selectedItem.typeSpecification,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="色号">
              {getFieldDecorator('colorNumber', {
                initialValue: selectedItem.colorNumber,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="球镜">
              {getFieldDecorator('sphere', {
                initialValue: selectedItem.sphere,
              })(<Input disabled />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="柱镜">
              {getFieldDecorator('lenticularGrating', {
                initialValue: selectedItem.lenticularGrating,
              })(<Input disabled />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="轴位">
              {getFieldDecorator('axialView', {
                initialValue: selectedItem.axialView,
              })(<Input disabled />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="折射率">
              {getFieldDecorator('refractiveIndex', {
                initialValue: selectedItem.refractiveIndex,
              })(<Input disabled />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="材质">
              {getFieldDecorator('texture', {
                initialValue: selectedItem.texture,
              })(<Input disabled />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="计量单位">
              {getFieldDecorator('unit', {
                initialValue: selectedItem.unit,
              })(<Input disabled />)}
            </FormItem>
          </Col>
        </Row>
      </>
    );
  };

  renderCommonProductsDetails = () => {
    const {
      instock = {} as ConnectState['instock'],
      outstock = {} as ConnectState['outstock'],
      kind,
      form,
    } = this.props;
    const { getFieldDecorator } = form;
    const { selectedItem = {} } = kind === 'instock' ? instock : outstock;

    return (
      <>
        <Row gutter={6}>
          <Col span={8}>
            <FormItem label="批号">
              {getFieldDecorator('productBatch', {
                initialValue: selectedItem.productBatch,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="商品名称">
              {getFieldDecorator('name', {
                initialValue: selectedItem.name,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="品牌">
              {getFieldDecorator('brand', {
                initialValue: selectedItem.brand,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="型号">
              {getFieldDecorator('typeSpecification', {
                initialValue: selectedItem.typeSpecification,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="色号">
              {getFieldDecorator('colorNumber', {
                initialValue: selectedItem.colorNumber,
              })(<Input disabled />)}
            </FormItem>
          </Col>
        </Row>
      </>
    );
  };

  renderDetails = () => {
    const {
      instock = {} as ConnectState['instock'],
      outstock = {} as ConnectState['outstock'],
    } = this.props;

    const { selectedItem = {} } = this.props.kind === 'instock' ? instock : outstock;
    const { category, kind } = selectedItem;
    const isContactLenses = selectedItem.kind === '2' ? true : false;

    // 隐形眼镜
    if (isContactLenses) {
      return this.renderContactLensesProductDetails();
    }

    // 镜框
    if (category === 'glassesFrame') {
      return this.renderGlassesFrameProductDetails();
    }

    //
    if (category === 'presbyopicGlasses') {
      return this.renderPresbyopicGlassesDetails();
    }

    if (kind === '1') {
      return this.renderEyeGlassProductDetails();
    }

    return this.renderCommonProductsDetails();
  };

  clearSelectedBatchInfo = () => {
    this.setState({
      selectedBatchInfo: {},
    });
  };

  handleAddItem = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    const { selectedBatchInfo = {} } = this.state;
    const {
      dispatch = {} as TheDispatch,
      instock = {} as ConnectState['instock'],
      outstock = {} as ConnectState['outstock'],
      kind,
      form,
    } = this.props;
    const { currentOrder, selectedItem = {} } = kind === 'instock' ? instock : outstock;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      dispatch({
        type: `${kind}/addStockOrderItem`,
        payload: {
          item: {
            orderID: currentOrder._id,
            productID: selectedItem._id,
            productName: selectedItem.name,
            productBatchID: selectedBatchInfo._id,
            productBatchNumber: selectedBatchInfo.batchNumber,
            total: values.total,
          },
        },
      });
    });

    this.toggleShowSelectPane();
    this.clearSelectedBatchInfo();
  };

  handlePrev = () => {
    const { prevStep } = this.props;
    if (prevStep) {
      prevStep('upgradeItem');
    }
  };

  handleNext = () => {
    const { nextStep } = this.props;

    const { kind } = this.props;
    const stockModel = this.props[kind];

    if (!stockModel) {
      return;
    }

    const { currentItems } = stockModel;

    if (nextStep) {
      nextStep(currentItems);
    }
  };

  render() {
    const {
      instock = {} as ConnectState['instock'],
      outstock = {} as ConnectState['outstock'],
      kind,
      form,
    } = this.props;
    const stockModel = kind === 'instock' ? instock : outstock;
    const { selectedItem = {} } = stockModel;
    const { getFieldDecorator } = form;
    const price = Number(form.getFieldValue('price')) || 0;
    const total = Number(form.getFieldValue('total')) || 0;
    const totalPrice = price * total;

    return (
      <div className={styles.upgradeItemsPane}>
        <div className={styles.body}>
          <div className={styles.productList}>
            <ProductList onAddOne={this.handleToggleShowAddStock} />
          </div>
          <div className={styles.content}>
            <DataTable
              columns={this.columnsConfig}
              disableToolbar
              title="已选商品"
              showPagination={false}
              rows={stockModel.currentItems || []}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <Button style={{ marginRight: '12px' }} onClick={this.handlePrev}>
            上一步
          </Button>
          <Button type="primary" onClick={this.handleNext}>
            下一步
          </Button>
        </div>

        <Modal
          visible={this.state.showSelectPane}
          title={<Typography.Text>添加库存</Typography.Text>}
          onCancel={this.toggleShowSelectPane}
          className={styles.modal}
          okText="添加"
          cancelText="取消"
          onOk={this.handleAddItem}
        >
          <Form>
            <Row>
              <Col span={24}>
                <NumberInfo
                  subTitle={<Typography.Text>进货总金额</Typography.Text>}
                  total={
                    <Typography.Paragraph>{`¥ ${numeral(totalPrice).format(
                      '0,0.00',
                    )}`}</Typography.Paragraph>
                  }
                />
              </Col>
            </Row>
            <Row>{this.renderDetails()}</Row>
            <Row gutter={12}>
              <Col span={12}>
                <FormItem label="金额">
                  {getFieldDecorator('price', {
                    initialValue: selectedItem.unitPurchasePrice,
                  })(<AmountInput disabled />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="总数">{getFieldDecorator('total')(<InputNumber />)}</FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create<UpgradeItemsPaneProps>()(UpgradeItemsPane);
