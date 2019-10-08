import React, { PureComponent, FormEvent } from 'react';
import {
  Form,
  Empty,
  Input,
  Typography,
  Row,
  Col,
  Button,
  Select,
  Icon,
  Modal,
  DatePicker,
  Drawer,
  Upload,
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import styles from './form.less';
import AmountInput from '@/components/DataEntry/AmountInput';
import { formatMessage } from 'umi-plugin-locale';
import DataTable from '@/components/DataTable';
import moment from 'moment';
import { ColumnProps } from '@/components/DataTable/interface';
import { genProductCode } from '@/utils/helper';
import { TheDispatch } from '@/models/connect';

const FormItem = Form.Item;

export interface IProductBatchNumber {}

interface IContactLensesForm extends FormComponentProps {
  initData?: any;
  onSubmit?: (values: any) => Promise<any>;
  onBatchCreate?: (values: any) => Promise<any>;
  onBatchRemove?: (values: any) => Promise<any>;
  loading?: boolean;
  batchRows?: any[];
  dispatch?: TheDispatch;
}

interface IContactLensesFormState {
  batchFormVisible?: boolean;
  batchDrawerVisible?: boolean;
  productCode?: string;
  createdProductID?: string;
  previewVisible?:boolean;
  previewImage?:string;
  fileList:Array<any>;
}

class ContactLensesForm extends PureComponent<IContactLensesForm, IContactLensesFormState> {
  state: IContactLensesFormState = {
    batchFormVisible: false,
    batchDrawerVisible: false,
    productCode: genProductCode(),
    createdProductID: '',
    previewVisible: false,
    previewImage: '',
    fileList:[],
  };

  get productBatchNumberColumn() {
    const columns: ColumnProps<IProductBatchNumber>[] = [
      {
        title: '生产批号',
        dataIndex: 'batchNumber',
      },
      {
        title: '度数',
        dataIndex: 'diopter',
      },
      {
        title: '基弧',
        dataIndex: 'BOZR',
      },
      {
        title: '直径',
        dataIndex: 'diameter',
        width: 150,
      },
      {
        title: '颜色',
        dataIndex: 'color',
        width: 150,
      },
      {
        title: '生产日期',
        dataIndex: 'startDate',
        width: 200,
        render: val => {
          if (!val) {
            return '--';
          }
          return <span>{moment(val).format('YYYY-MM-DD')}</span>;
        },
      },
      {
        title: '失效日期',
        dataIndex: 'expirationDate',
        width: 200,
        render: val => {
          if (!val) {
            return '--';
          }
          return <span>{moment(val).format('YYYY-MM-DD')}</span>;
        },
      },
      {
        title: '操作',
        dataIndex: 'actions',
        align: 'left',
        width: 100,
        render: (val, record) => {
          return (
            <span>
              <Button onClick={this.handleBatchRemove(record)} size="small" icon="delete" />
            </span>
          );
        },
      },
    ];

    return columns;
  }

  handleBatchRemove = (record: any) => (e?: React.MouseEvent) => {
    // e.preventDefault();
    if (e) {
      e.preventDefault();
    }
    const { onBatchRemove } = this.props;

    onBatchRemove &&
      onBatchRemove(record._id).then(() => {
        this.refreshBatch();
      });
  };

  refreshBatch = () => {
    const { dispatch } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'product/loadBatchList',
      payload: {
        id: this.state.createdProductID,
      },
    });
  };

  handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    let pictures =  this.getPicturesForFileList();
    if (form) {
      const { validateFieldsAndScroll } = form;
      
      validateFieldsAndScroll(
        [
          'code',
          'category',
          'name',
          'registerCode',
          'manufacturers',
          'unit',
          'unitPurchasePrice',
          'brand',
          'provider',
          'salePrice',
        ],
        (err, values) => {
          if (!err) {
            values.kind = '2';
            values.salePrice = Number(values.salePrice);
            values.unitPurchasePrice = Number(values.unitPurchasePrice);
            values.productionBatch = [];
            values.pictures = pictures;
            onSubmit &&
              onSubmit(values).then(id => {
                if (id) {
                  form.resetFields();
                  this.setState({
                    productCode: genProductCode(),
                    createdProductID: id,
                  });

                  // 弹出批次管理
                  Modal.confirm({
                    title: `添加成功`,
                    content: '商品基本信息已经添加成功, 您是否要继续添加该产品的批次信息?',
                    cancelText: '不, 以后再完善',
                    okText: '去添加',
                    onOk: () => {
                      this.refreshBatch();
                      this.setState({
                        batchDrawerVisible: true,
                      });
                    },
                  });
                }
              });
          }
        },
      );
    }
  };

  getPicturesForFileList = () =>{
    const { fileList } = this.state;
    let pictures:string[] = [];
    fileList.forEach(e => {
      if(e.response){
        e.response.files.forEach((element:any) => {
          pictures.push(element.id);
        });
      }
    });
    return pictures;
  }

  getFieldValue = (key: string) => {
    const { form } = this.props;
    if (!form) {
      return null;
    }
    return form.getFieldValue(key);
  };

  addBatch = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    const { form, onBatchCreate } = this.props;

    if (form) {
      form.validateFieldsAndScroll(['batch'], (err, values) => {
        if (!err) {
          onBatchCreate &&
            onBatchCreate({
              ...values.batch,
              productID: this.state.createdProductID,
            }).then(() => {
              this.refreshBatch();
            });
          // console.log(values, 'values');
          // const { batchRows = [] } = this.state;
          // batchRows.push(values.batch);
          // this.setState({
          //   batchRows,
          // });
          // const { dispatch } = this.props;

          // dispatch({
          //   type: 'product/createOneProduct',
          //   payload: {
          //     ...values,
          //     productID: this.state.createdProductID,
          //   },
          // });
          this.closeBatchForm();
        }
      });
    }
  };

  handleCloseDrawer = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }

    this.setState({
      batchDrawerVisible: false,
    });
  };

  openBatchForm = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }

    this.setState({
      batchFormVisible: true,
    });
  };

  closeBatchForm = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }

    this.setState({
      batchFormVisible: false,
    });
  };

  getBase64(file:any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  // handleCancel = () => this.setState({ previewVisible: false });
  
  handleCancel = () => {
    this.setState({ previewVisible: false });
  }
  handleChange = (obj: any) => {
    this.setState({ fileList: [ ...obj.fileList ] });
  };

  handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };


  render() {
    const { form, initData = {} } = this.props;
    if (!form) {
      return <Empty />;
    }

    const { getFieldDecorator } = form;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    return (
      <>
        <Form name="base" className={styles.formContainer} onSubmit={this.handleSubmit}>
          <div className={styles.form}>
            <div className={styles.formCard}>
              <div className={styles.baseInfo}>
                <Typography.Title level={3}>基本信息</Typography.Title>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <FormItem label="商品条码">
                      {getFieldDecorator('code', {
                        initialValue: initData.code || this.state.productCode,
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
                    <FormItem label="商品分类">
                      {getFieldDecorator('category', {
                        initialValue: initData.category,
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'product.category.required' }),
                          },
                        ],
                      })(
                        <Select size="large" placeholder="选择商品类型">
                          <Select.Option value="contactLenses">隐形眼镜</Select.Option>
                          <Select.Option value="contactLensesSolutions">护理液</Select.Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <FormItem label="商品名称">
                      {getFieldDecorator('name', {
                        initialValue: initData.name,
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
                    <FormItem label="注册证号">
                      {getFieldDecorator('registerCode', {
                        initialValue: initData.registerCode,
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'product.name.required' }),
                          },
                        ],
                      })(<Input placeholder="注册证号" size="large" />)}
                    </FormItem>
                  </Col>

                  <Col xs={24} sm={12}>
                    <FormItem label="生产企业">
                      {getFieldDecorator('manufacturers', {
                        initialValue: initData.manufacturers,
                      })(
                        <Input placeholder="生产企业" size="large" />,
                      )}
                    </FormItem>
                  </Col>

                  <Col xs={24} sm={12}>
                    <FormItem label="计量单位">
                      {getFieldDecorator('unit', {
                        initialValue: initData.unit,
                      })(<Input placeholder="计量单位" size="large" />)}
                    </FormItem>
                  </Col>
                </Row>
              </div>

              <div className={styles.extendInfo}>
                <Typography.Title level={3}>扩展信息</Typography.Title>
                <Row>
                  <Col xs={24} sm={24}>
                    <FormItem label="商品图片" >
                      <Upload
                        action="/apis/file/upload"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                        name="files"
                      >
                        {fileList.length >= 5 ? null : uploadButton}
                      </Upload>
                      <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                      </Modal>
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <FormItem label="供应商">
                      {getFieldDecorator('provider', {
                        initialValue: initData.provider,
                      })(<Input placeholder="供应商" size="large" />)}
                    </FormItem>
                  </Col>

                  <Col xs={24} sm={12}>
                    <FormItem label="商品售价">
                      {getFieldDecorator('salePrice', {
                        initialValue: initData.salePrice,
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
                        initialValue: initData.unitPurchasePrice,
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
                    <FormItem label="品牌">
                      {getFieldDecorator('brand')(<Input placeholder="品牌" size="large" />)}
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

        <Drawer
          title="管理批次"
          placement="right"
          closable={false}
          width="100%"
          className={styles.batchDrawer}
          visible={this.state.batchDrawerVisible}
        >
          <div className={styles.batchDrawerWrapper}>
            <div className={styles.tableInfo}>
              <DataTable
                rows={this.props.batchRows || []}
                showSearch={false}
                showPagination={false}
                fixedColumnsRight={['actions']}
                fixedColumnsLeft={['batchNumber']}
                columns={this.productBatchNumberColumn}
                actions={
                  <Button type="dashed" onClick={this.openBatchForm}>
                    <Icon type="plus" /> 添加批次
                  </Button>
                }
              />
              {/* <Typography.Title level={3}>批次信息</Typography.Title>

            <div style={{ height: '250px' }}>
              
            </div> */}
            </div>

            <div className={styles.footer}>
              <Button
                type="primary"
                style={{ marginRight: '15px' }}
                onClick={this.handleCloseDrawer}
              >
                已经完成
              </Button>
              <Button type="dashed" onClick={this.handleCloseDrawer}>
                我要退出
              </Button>
            </div>
          </div>
        </Drawer>

        <Modal
          title="添加批次"
          centered
          visible={this.state.batchFormVisible}
          onOk={this.addBatch}
          onCancel={this.closeBatchForm}
        >
          <Form name="batch">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <FormItem label="批号">
                  {getFieldDecorator('batch.batchNumber', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'product.batchNumber.required' }),
                      },
                    ],
                  })(<Input placeholder="批号" />)}
                </FormItem>
              </Col>
              <Col xs={24} sm={12}>
                <FormItem label="直径">
                  {getFieldDecorator('batch.diameter', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'product.diameter.required' }),
                      },
                    ],
                  })(<Input placeholder="直径" />)}
                </FormItem>
              </Col>
              <Col xs={24} sm={12}>
                <FormItem label="颜色">
                  {getFieldDecorator('batch.color', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'product.color.required' }),
                      },
                    ],
                  })(<Input placeholder="颜色" />)}
                </FormItem>
              </Col>
              <Col xs={24} sm={12}>
                <FormItem label="度数">
                  {getFieldDecorator('batch.diopter', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'product.diopter.required' }),
                      },
                    ],
                  })(<Input placeholder="度数" />)}
                </FormItem>
              </Col>
              <Col xs={24} sm={12}>
                <FormItem label="基弧">
                  {getFieldDecorator('batch.BOZR', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'product.BOZR.required' }),
                      },
                    ],
                  })(<Input placeholder="基弧" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <FormItem label="生产日期">
                  {getFieldDecorator('batch.startDate', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'product.startDate.required' }),
                      },
                    ],
                  })(<DatePicker style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col xs={24} sm={12}>
                <FormItem label="失效日期">
                  {getFieldDecorator('batch.expirationDate', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'product.expirationDate.required' }),
                      },
                    ],
                  })(<DatePicker style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create<IContactLensesForm>()(ContactLensesForm);
