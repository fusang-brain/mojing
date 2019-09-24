import { PureComponent } from 'react';
import {
  Card,
  List,
  Typography,
  Button,
  Icon,
  Row,
  Col,
  Checkbox,
  Tag,
  Modal,
  Form,
  Input,
} from 'antd';
import styles from './style.less';
import { BaseProps, ConnectState, TheDispatch } from '@/models/connect';
import { connect } from 'dva';
import { findGroupAccess } from '@/services/accessGroup';
import { AxiosResponse } from 'axios';
import classNames from 'classnames';
import Loading from '@/components/Loading';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { FormComponentProps } from 'antd/lib/form';

function sortAccesses(accesses: any[]) {
  return accesses.sort((a, b) => a.length - b.length);
}

interface IAccessConfigProps extends BaseProps, FormComponentProps {
  accessGroup?: ConnectState['accessGroup'];
}

interface IAccessConfigState {
  selectedAccessGroup?: string;
  selectedAccessGroupInfo?: { [key: string]: any };
  lastAccessCheckboxSign?: string;
  accessCheckbox?: string[];
  accessCheckboxAll?: string[];
  showAddField?: boolean;
  showUpdateRoleDialog?: boolean;
  loadingAccesses?: boolean;
  currentAccess?: {
    id: string;
    name: string;
  };
  showAddRoleModal?: boolean;
}

@connect((s: ConnectState) => ({
  accessGroup: s.accessGroup,
}))
class AccessConfig extends PureComponent<IAccessConfigProps, IAccessConfigState> {
  state: IAccessConfigState = {
    selectedAccessGroup: '',
    selectedAccessGroupInfo: {},
    lastAccessCheckboxSign: '',
    accessCheckbox: [],
    accessCheckboxAll: [],
    showAddField: false,
    showUpdateRoleDialog: false,
    loadingAccesses: false,
    currentAccess: {
      id: '',
      name: '',
    },
    showAddRoleModal: false,
  };

  get selectedAccessGroup() {
    const { accessGroup = {} as ConnectState['accessGroup'] } = this.props;
    const {
      listDetails: { list = [] },
    } = accessGroup;
    let defaultGroup;
    if (list[0]) {
      defaultGroup = list[0]._id;
    }

    return this.state.selectedAccessGroup || defaultGroup;
  }

  get selectedAccessGroupInfo() {
    const { accessGroup = {} as ConnectState['accessGroup'] } = this.props;
    const { selectedAccessGroupInfo = {} } = this.state;
    const {
      listDetails: { list = [] },
    } = accessGroup;
    let defaultGroup: any = {};
    if (list[0]) {
      defaultGroup = list[0] || {};
    }

    return selectedAccessGroupInfo.role ? this.state.selectedAccessGroupInfo : defaultGroup;
  }

  /**
   * 判断是否保存权限的按钮需要显示
   */
  isDisableSaveAccess = () => {
    // const
    const { selectedAccessGroupInfo = {}, accessCheckbox, lastAccessCheckboxSign } = this.state;
    if (selectedAccessGroupInfo.role === 'root') {
      return true;
    }

    if (lastAccessCheckboxSign === JSON.stringify(sortAccesses(accessCheckbox || []))) {
      return true;
    }

    return false;
  };

  /**
   * 保存权限到当前权限组
   */
  handleSaveAccess = () => {
    const { accessCheckbox, selectedAccessGroup } = this.state;

    const { dispatch = {} as TheDispatch } = this.props;
    dispatch({
      type: 'accessGroup/saveAccessToCurrentGroup',
      payload: {
        groupID: selectedAccessGroup,
        accesses: accessCheckbox,
      },
    });
  };

  getGroupAccess = (id: string) => {
    this.setState({
      loadingAccesses: true,
    });
    findGroupAccess(id).then((resp: AxiosResponse) => {
      const { data } = resp;
      const { accesses } = data;

      this.setState({
        lastAccessCheckboxSign: JSON.stringify(sortAccesses(accesses)),
        accessCheckbox: accesses,
        loadingAccesses: false,
      });
    });
  };

  /**
   * 选择某个权限
   */
  handleAccessChecked = (id: string) => (event: CheckboxChangeEvent) => {
    let { accessCheckbox = [] } = this.state;

    if (event.target.checked && accessCheckbox.indexOf(id) < 0) {
      accessCheckbox.push(id);
    } else {
      accessCheckbox = accessCheckbox.filter(v => v !== id);
    }

    this.setState({
      accessCheckbox: [...accessCheckbox],
    });
  };

  /**
   * 选择权限组
   */
  handleSelectAccessGroup = (record: any) => () => {
    const id = record._id;
    this.setState({
      selectedAccessGroup: id,
      selectedAccessGroupInfo: record,
    });
    this.getGroupAccess(id);
  };

  /**
   * 删除角色
   */
  handleDeleteRole = (group: any) => () => {
    const { dispatch = {} as TheDispatch } = this.props;

    Modal.confirm({
      title: `删除角色组 ${group.name}`,
      content: `删除角色组 ${group.name} 时, 将同时删除该角色组成员被赋予的权限, 是否继续删除？`,
      onOk: () => {
        dispatch({
          type: 'accessGroup/remove',
          payload: group.id,
        });
      },
      cancelText: '取消',
      okText: '删除',
    });
  };

  startAddRole = () => {
    this.setState({
      showAddRoleModal: true,
    });
  };

  handleSaveAccessGroup = () => {
    const { dispatch = {} as TheDispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values: any) => {
      if (!err) {
        dispatch({
          type: 'accessGroup/create',
          payload: {
            name: values.name,
            kind: 'enterprise',
          },
        }).then(() => {
          this.setState({
            showAddRoleModal: false,
          });
        });
      }
    });
  };

  componentDidMount() {
    const { dispatch = {} as TheDispatch } = this.props;

    dispatch({
      type: 'accessGroup/loadList',
    }).then(list => {
      if (list[0]) {
        this.getGroupAccess(list[0]._id);
      }
    });

    dispatch({
      type: 'accessGroup/loadAllAccess',
    });
  }

  render() {
    const { accessGroup = {} as ConnectState['accessGroup'], form } = this.props;
    const { listDetails, accesses = [] } = accessGroup;
    const { accessCheckbox = [] } = this.state;
    const { getFieldDecorator } = form;
    return (
      <>
        <Card title="权限设置" className={styles.card}>
          <div className={styles.inner}>
            <div className={styles.list}>
              <List
                className={styles.listContainer}
                size="small"
                header={<Typography.Title level={4}>角色列表</Typography.Title>}
                footer={
                  <Button type="dashed" onClick={this.startAddRole}>
                    添加
                  </Button>
                }
                bordered={false}
                dataSource={listDetails.list || []}
                renderItem={item => (
                  <List.Item
                    onClick={this.handleSelectAccessGroup(item)}
                    className={classNames(styles.item, {
                      [styles.selected]: this.selectedAccessGroup === item._id,
                    })}
                    actions={[
                      item.kind === 'system' ? (
                        <Tag>系统角色</Tag>
                      ) : (
                        <Button key="delete" onClick={this.handleDeleteRole(item)} size="small">
                          <Icon type="delete" />
                        </Button>
                      ),
                    ]}
                  >
                    <List.Item.Meta
                      style={{ padding: '0 8px' }}
                      title={
                        <>
                          <Typography.Text>{item.name}</Typography.Text>{' '}
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>

            <Loading
              delay={600}
              wrapperClassName={styles.content}
              spinning={this.state.loadingAccesses}
              // spinning
            >
              <div className={styles.body}>
                <List
                  className={styles.listContainer}
                  size="large"
                  header={
                    <div className={styles.title}>
                      <Typography.Title level={4}>权限列表</Typography.Title>
                      <div className={styles.action}>
                        <Button
                          onClick={this.handleSaveAccess}
                          disabled={this.isDisableSaveAccess()}
                        >
                          保存
                        </Button>
                      </div>
                    </div>
                  }
                  bordered={false}
                  dataSource={accesses}
                  renderItem={(item, index) => (
                    <List.Item key={`accesses_${index}`}>
                      <List.Item.Meta
                        title={<Typography.Text>{item.subjectName}</Typography.Text>}
                        description={
                          <Row>
                            {item.accesses.map((access: any, index: number) => (
                              <Col key={`access_${index}`} span={6}>
                                <Checkbox
                                  disabled={this.selectedAccessGroupInfo.role === 'root'}
                                  name={access._id}
                                  onChange={this.handleAccessChecked(access.id)}
                                  value={access.id}
                                  checked={
                                    accessCheckbox.indexOf(access.id) >= 0 ||
                                    this.selectedAccessGroupInfo.role === 'root'
                                  }
                                >
                                  {access.displayName}
                                </Checkbox>
                              </Col>
                            ))}
                          </Row>
                        }
                      />
                    </List.Item>
                  )}
                />
              </div>
            </Loading>

            <Modal
              title="添加角色"
              centered
              visible={this.state.showAddRoleModal}
              onCancel={() => {
                this.setState({
                  showAddRoleModal: false,
                });
              }}
              onOk={this.handleSaveAccessGroup}
            >
              <Form>
                <Form.Item>{getFieldDecorator('name')(<Input placeholder="角色名称" />)}</Form.Item>
              </Form>
            </Modal>
          </div>
        </Card>
      </>
    );
  }
}

export default Form.create<IAccessConfigProps>()(AccessConfig);
