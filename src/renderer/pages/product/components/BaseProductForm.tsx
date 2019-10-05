import React, { PureComponent, FormEvent } from 'react';
import { Form, Empty, Input, Select, Typography, Row, Col, Button ,Icon ,Upload ,Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import styles from './form.less';
import AmountInput from '@/components/DataEntry/AmountInput';
import { formatMessage } from 'umi-plugin-locale';
import { genProductCode } from '@/utils/helper';
const FormItem = Form.Item;

interface IBaseProductFormProps extends FormComponentProps {
  onSubmit?: (values: any) => Promise<any>;
  loading?: boolean;
}

interface FormState {
  productCode?: string;
  previewVisible?:boolean;
  previewImage?:string;
  fileList: Array<any>;
}

class BaseProductFormView extends PureComponent<IBaseProductFormProps, FormState> {
  state: FormState = {
    productCode: genProductCode(),
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };


  // 提交表单
  handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    let pictures =  this.getPicturesForFileList();
    if (form) {
      const { validateFieldsAndScroll } = form;
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          values['kind'] = '0';
          values.salePrice = Number(values.salePrice);
          values.unitPurchasePrice = Number(values.unitPurchasePrice);
          values.pictures = pictures;
          onSubmit &&
            onSubmit(values).then(ok => {
              if (ok) {
                form.resetFields();
                this.setState({
                  productCode: genProductCode(),
                });
              }
            });
        }
      });
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

  getBase64(file:any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  handleCancel = () => this.setState({ previewVisible: false });
  
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
    const { form } = this.props;
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
      <Form className={styles.formContainer} onSubmit={this.handleSubmit}>
        <div className={styles.form}>
          <div className={styles.formCard}>
            <div className={styles.baseInfo}>
              <Typography.Title level={3}>基本信息</Typography.Title>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <FormItem label="商品条码">
                    {getFieldDecorator('code', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'product.code.required' }),
                        },
                      ],
                      initialValue: this.state.productCode,
                    })(<Input placeholder="商品条码" size="large" />)}
                  </FormItem>
                </Col>

                <Col xs={24} sm={12}>
                  <FormItem label="商品分类">
                    {getFieldDecorator('category', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'product.category.required' }),
                        },
                      ],
                    })(
                      <Select size="large" placeholder="选择商品类型">
                        <Select.Option value="glassesFrame">镜框</Select.Option>
                        <Select.Option value="presbyopicGlasses">老花镜</Select.Option>
                        <Select.Option value="sunGlasses">太阳镜</Select.Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <FormItem label="商品名称">
                    {getFieldDecorator('name', {
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
                  <FormItem label="商品售价">
                    {getFieldDecorator('salePrice', {
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
                  <FormItem label="生产企业">
                    {getFieldDecorator('manufacturers')(
                      <Input placeholder="生产企业" size="large" />,
                    )}
                  </FormItem>
                </Col>

                <Col xs={24} sm={12}>
                  <FormItem label="供货商">
                    {getFieldDecorator('provider')(<Input placeholder="供货商" size="large" />)}
                  </FormItem>
                </Col>

                <Col xs={24} sm={12}>
                  <FormItem label="品牌">
                    {getFieldDecorator('brand')(<Input placeholder="品牌" size="large" />)}
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
                  <FormItem label="型号">
                    {getFieldDecorator('typeSpecification')(
                      <Input placeholder="型号" size="large" />,
                    )}
                  </FormItem>
                </Col>

                <Col xs={24} sm={12}>
                  <FormItem label="色号">
                    {getFieldDecorator('colorNumber')(<Input placeholder="色号" size="large" />)}
                  </FormItem>
                </Col>

                {this.getFieldValue('category') === 'presbyopicGlasses' ? (
                  <Col xs={24} sm={12}>
                    <FormItem label="度数">
                      {getFieldDecorator('diopter')(<Input placeholder="度数" size="large" />)}
                    </FormItem>
                  </Col>
                ) : null}

                {this.getFieldValue('category') === 'glassesFrame' ? (
                  <>
                    <Col xs={24} sm={12}>
                      <FormItem label="镜架高度">
                        {getFieldDecorator('frameHeight')(
                          <Input placeholder="镜架高度" size="large" />,
                        )}
                      </FormItem>
                    </Col>

                    <Col xs={24} sm={12}>
                      <FormItem label="架面宽度">
                        {getFieldDecorator('frameWidth')(
                          <Input placeholder="架面宽度" size="large" />,
                        )}
                      </FormItem>
                    </Col>

                    <Col xs={24} sm={12}>
                      <FormItem label="鼻梁宽度">
                        {getFieldDecorator('noseBridgeWeight')(
                          <Input placeholder="鼻梁宽度" size="large" />,
                        )}
                      </FormItem>
                    </Col>

                    <Col xs={24} sm={12}>
                      <FormItem label="镜腿长">
                        {getFieldDecorator('frameLegLength')(<Input size="large" />)}
                      </FormItem>
                    </Col>
                    <Col xs={24} sm={12}>
                      <FormItem label="镜架重量">
                        {getFieldDecorator('frameWeight')(<Input size="large" />)}
                      </FormItem>
                    </Col>
                  </>
                ) : null}
              </Row>
            </div>
          </div>
        </div>

        <div className={styles.formFooter}>
          <Button type="primary" loading={this.props.loading} htmlType="submit">
            保存
          </Button>
        </div>
      </Form>
    );
  }
}

export default Form.create<IBaseProductFormProps>()(BaseProductFormView);
