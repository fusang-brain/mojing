import React, { PureComponent } from 'react';
import styles from './styles.less';
import InfiniteScroll from 'react-infinite-scroller';
import { List, Avatar, Button, Spin, message, Icon, Typography, Input, Row, Col } from 'antd';
import { findSimpleProductList } from '@/services/product';
import { AxiosResponse } from 'axios';
import MJIcon from '../MJIcon';

const antIcon = <MJIcon type="icon-Loading" style={{ fontSize: 24 }} spin />;

export interface SimpleProduct {
  code?: string;
  id?: string;
  name?: string;
}

interface ProductListViewProps {
  count?: number;
  onAddOne?: (val: SimpleProduct) => void;
}

interface ProductListViewState {
  loading?: boolean;
  hasMore?: boolean;
  dataStore?: any[];
  currentPage?: number;
  // pageStart?: number;
  search?: string;
}

class ProductListView extends PureComponent<ProductListViewProps, ProductListViewState> {
  private pageStart: number = 0;

  state: ProductListViewState = {
    // pageStart: -1,
    loading: false,
    hasMore: true,
    dataStore: [],
    currentPage: 0,
    search: '',
  };

  pageToSkip = (page: number, count: number) => {
    return (page - 1) * count;
  };

  loadData = (pageStart?: number) => {
    if (pageStart) this.pageStart = pageStart;

    if (this.pageStart <= 0) {
      this.pageStart = 1;
    }
    const page = this.pageStart;
    let { dataStore = [] } = this.state;
    let count = this.props.count || 15;

    this.setState({
      loading: true,
    });

    findSimpleProductList({
      skip: this.pageToSkip(this.pageStart, count),
      count,
      search: this.state.search || undefined,
    }).then((resp: AxiosResponse) => {
      if (resp) {
        const { status, data } = resp;
        if (status === 200) {
          const { list = [], total = 0 } = data;

          if (dataStore.length >= total) {
            message.warning('数据已经全部加载');
            this.setState({
              hasMore: false,
              loading: false,
              currentPage: page - 1,
            });
            return;
          }

          if (this.state.currentPage !== page) {
            dataStore = dataStore.concat(list);
          }

          this.setState({
            dataStore,
            loading: false,
            hasMore: true,
            currentPage: page,
          });
          this.pageStart = this.pageStart + 1;
          return;
        }
      }

      message.warning('数据加载错误');
      return;
    });
  };

  handleInfiniteOnLoad = (page: number) => {
    this.loadData();
  };

  handleSearch = (value: any) => {
    // 开始搜索，初始化开始页
    this.pageStart = 1;
    this.setState(
      {
        search: value,
        dataStore: [],
        currentPage: 0,
      },
      () => {
        this.loadData(this.pageStart);
      },
    );
  };

  cancelSearch = () => {
    // 取消搜索，初始化开始页
    this.pageStart = 1;
    this.setState(
      {
        search: undefined,
        dataStore: [],
        currentPage: 0,
      },
      () => {
        this.loadData(this.pageStart);
      },
    );
  };

  componentDidMount() {
    // this.handleInfiniteOnLoad(1);
    this.loadData(1);
  }

  render() {
    return (
      <div className={styles.productListContainer}>
        <div className={styles.titleBar}>
          <Row gutter={16} style={{ width: '100%' }}>
            <Col span={10}>
              <Typography.Title level={4}>商品列表</Typography.Title>
            </Col>
            <Col span={14}>
              <Input.Search
                onSearch={this.handleSearch}
                onChange={e => {
                  e.preventDefault();
                  if (e.target.value === '') {
                    this.cancelSearch();
                  }
                }}
                style={{ width: '100%' }}
                placeholder="名称/编码"
              />
            </Col>
          </Row>
        </div>
        <div className={styles.content}>
          <InfiniteScroll
            initialLoad={false}
            // pageStart={pageStart > 0 ? pageStart : 1}
            loadMore={this.handleInfiniteOnLoad}
            hasMore={!this.state.loading && this.state.hasMore}
            useWindow={false}
          >
            <List
              dataSource={this.state.dataStore}
              renderItem={item => (
                <List.Item key={item._id}>
                  <List.Item.Meta
                    avatar={<Avatar shape="square">商</Avatar>}
                    title={<Typography.Text>{item.name}</Typography.Text>}
                    description={`商品编号: ${item.code}`}
                  />
                  <Button
                    size="small"
                    type="dashed"
                    onClick={() => {
                      if (this.props.onAddOne) {
                        this.props.onAddOne(item);
                      }
                    }}
                  >
                    <Icon type="plus" />
                  </Button>
                </List.Item>
              )}
            >
              {this.state.loading && this.state.hasMore && (
                <div className={styles.loadingContainer}>
                  <Spin tip="加载中..." indicator={antIcon} />
                </div>
              )}
            </List>
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

export default ProductListView;
