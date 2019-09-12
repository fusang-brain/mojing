import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';
import styles from './index.less';
import BaseProductForm from '../components/BaseProductForm';
import EyeglassesForm from '../components/EyeglassesForm';
import ServiceProductForm from '../components/ServiceProductForm';
import ContactLensesForm from '../components/ContactLensesForm';
import { BaseProps, ConnectState } from '@/models/connect';
import { connect } from 'dva';

const { TabPane } = Tabs;

interface AddProductViewProps extends BaseProps {
  batchListDetails?: ConnectState['product']['batchListDetails'];
}

@connect((all: ConnectState) => ({
  loading: all.loading,
  batchListDetails: all.product.batchListDetails,
}))
export default class AddProductView extends React.Component<AddProductViewProps> {
  handleSubmit = (values: any) => {
    const { dispatch } = this.props;
    // console.log(values, 'values');

    // // todo api
    if (!dispatch) {
      return Promise.reject(false);
    }

    return dispatch({
      type: 'product/createProduct',
      payload: values,
    });
  };

  handleBatchCreate = (values: any) => {
    const { dispatch } = this.props;
    if (!dispatch) {
      return Promise.reject(false);
    }
    return dispatch({
      type: 'product/createOneProductBatch',
      payload: values,
    });
  };

  handleBatchRemove = (id: any) => {
    const { dispatch } = this.props;
    if (!dispatch) {
      return Promise.reject(false);
    }
    return dispatch({
      type: 'product/removeOneProductBatch',
      payload: id,
    });
  };

  render() {
    const { loading, batchListDetails } = this.props;
    const submiting = loading && loading.effects['product/createProduct'];
    return (
      <PageHeaderWrapper content="为您的店铺新增一种商品">
        <Card style={{ width: '100%', height: '100%' }}>
          <div className={styles.tabsContainer}>
            <Tabs type="card" tabPosition="left">
              <TabPane tab="普通商品" key="1">
                <BaseProductForm loading={submiting} onSubmit={this.handleSubmit} />
              </TabPane>

              <TabPane tab="镜片" key="2">
                <EyeglassesForm loading={submiting} onSubmit={this.handleSubmit} />
              </TabPane>

              <TabPane tab="隐形眼镜" key="3">
                <ContactLensesForm
                  loading={submiting}
                  batchRows={batchListDetails && (batchListDetails.list || [])}
                  onSubmit={this.handleSubmit}
                  onBatchCreate={this.handleBatchCreate}
                  onBatchRemove={this.handleBatchRemove}
                  dispatch={this.props.dispatch}
                />
              </TabPane>

              <TabPane tab="服务项目" key="4">
                <ServiceProductForm loading={submiting} onSubmit={this.handleSubmit} />
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
