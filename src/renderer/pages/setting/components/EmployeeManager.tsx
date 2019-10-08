import { PureComponent } from 'react';
import { Card, Tag, Modal, Input, Row, Col, Select, Button, Icon } from 'antd';
import styles from './style.less';
import DataTable from '@/components/DataTable';
import { ColumnProps } from '@/components/DataTable/interface';
import { IEmployee } from '../models/employee';
import { TheDispatch, BaseProps, ConnectState } from '@/models/connect';
import Form, { FormComponentProps } from 'antd/lib/form';
import { formatMessage } from 'umi-plugin-locale';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

export interface IEmployeeManagerProps extends BaseProps, FormComponentProps {
  employee?: IEmployee;
}

export interface IEmployeeManagerState {
  openCreateDialog?: boolean;
  openUpdateDialog?: boolean;
  currentEmployee?: {
    id?: string;
    [key: string]: any;
  };
}

@connect((s: ConnectState) => ({
  loading: s.loading,
  employee: s.employee,
}))
class EmployeeManager extends PureComponent<IEmployeeManagerProps, IEmployeeManagerState> {
  state: IEmployeeManagerState = {
    openCreateDialog: false,
    openUpdateDialog: false,
    currentEmployee: {
      id: '',
    },
  };

  get columnProps(): ColumnProps<any>[] {
    return [
      {
        title: '姓名',
        width: 200,
        align: 'left',
        dataIndex: 'name',
      },
      {
        title: '手机',
        width: 150,
        dataIndex: 'user.phone',
      },
      // {
      //   title: '邮箱',
      //   width: 200,
      //   dataIndex: 'user.email',
      // },
      {
        title: '角色',
        width: 200,
        dataIndex: 'employeeRole',
        render: values => {
          const { accessGroup = {} } = values;
          return <Tag>{accessGroup.name}</Tag>;
        },
      },
      {
        title: '职位',
        width: 200,
        dataIndex: 'job',
      },
      {
        title: '操作',
        width: 100,
        align: 'right',
        dataIndex: 'action',
        render: (txt: string, record: any) => {
          console.log(txt, record);
          return (
            <>
              <Button size="small" onClick={this.openUpdateDialog(record)}>
                <Icon type="edit" />
              </Button>
              <Button size="small" onClick={this.handleDelete(record)}>
                <Icon type="delete" />
              </Button>
            </>
          );
        },
      },
    ];
  }

  handleDelete = (record: any) => () => {
    const { dispatch = {} as TheDispatch } = this.props;
    Modal.confirm({
      title: `是否要将${record.name}移出本企业？`,
      content: '本次删除操作将是不可逆的，请确定是否删除',
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'employee/removeEmployee',
          payload: record._id,
        });
      },
    });
  };

  openUpdateDialog = (value: any) => () => {
    const { accessGroup = {} } = value.employeeRole || {};
    this.setState({
      currentEmployee: {
        id: value._id,
        name: value.name,
        job: value.job,
        role: accessGroup._id,
      },
    });

    this.toggleUpdateDialog();
  };

  toggleCreateDialog = () => {
    this.setState({
      openCreateDialog: !this.state.openCreateDialog,
    });
  };

  toggleUpdateDialog = () => {
    this.setState({
      openUpdateDialog: !this.state.openUpdateDialog,
    });
  };

  handlePageChange = (page: number, pageSize?: number) => {
    const { dispatch = {} as TheDispatch } = this.props;

    dispatch({
      type: 'employee/loadList',
      payload: {
        page,
        pageSize,
      },
    });
  };

  handleSubmit = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const { dispatch = {} as TheDispatch, form } = this.props;
    form.validateFieldsAndScroll(['create'], (err, values) => {
      // console.log(values, 'values');
      if (!err) {
        dispatch({
          type: 'employee/createEmployee',
          payload: values.create,
        });
      }
    });

    this.toggleCreateDialog();
  };

  handleUpdateSubmit = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const { dispatch = {} as TheDispatch, form } = this.props;
    const { currentEmployee = {} } = this.state;

    form.validateFieldsAndScroll(['update'], (err, values) => {
      const value: any = values.update;
      if (!err) {
        dispatch({
          type: 'employee/updateEmployee',
          payload: {
            id: currentEmployee.id,
            realname: value.realname,
            job: value.job,
            role: value.role,
          },
        });
      }
    });

    this.toggleUpdateDialog();
  };

  handleSearch = (value: any) => {
    const { dispatch = {} as TheDispatch } = this.props;
    dispatch({
      type: 'employee/loadList',
      payload: {
        search: value,
      },
    });
  };

  componentDidMount() {
    const { dispatch = {} as TheDispatch } = this.props;
    dispatch({
      type: 'employee/loadList',
    });
    dispatch({
      type: 'employee/loadRoles',
    });
  }

  render() {
    const {
      employee = {} as ConnectState['employee'],
      loading = {} as ConnectState['loading'],
      form,
    } = this.props;
    const { getFieldDecorator } = form;
    const { currentEmployee = {} } = this.state;

    const { listDetails, roles = [] } = employee;
    const { pagination } = listDetails;
    console.log(roles, 'roles');
    return (
      <>
        <Card title="成员管理" className={styles.card}>
          <div className={styles.inner}>
            <DataTable
              rows={listDetails.list}
              showSearch
              actions={<Button onClick={this.toggleCreateDialog}>添加员工</Button>}
              onSearch={this.handleSearch}
              fixedColumnsLeft={['name']}
              fixedColumnsRight={['action']}
              columns={this.columnProps}
              loading={loading.effects['employee/loadList']}
              paginationConfig={{
                current: pagination.page,
                pageSize: pagination.pageSize,
                total: pagination.total,
                onPageChange: this.handlePageChange,
              }}
            />
          </div>
        </Card>

        <Modal
          title="添加员工"
          visible={this.state.openCreateDialog}
          okText="提交"
          cancelText="取消"
          destroyOnClose={true}
          onCancel={this.toggleCreateDialog}
          onOk={this.handleSubmit}
        >
          <Form name="create">
            <Row gutter={12}>
              <Col span={12}>
                <FormItem label="员工姓名">
                  {getFieldDecorator('create.realname', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'employee.realname.required' }),
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="手机号">
                  {getFieldDecorator('create.phone', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'employee.phone.required' }),
                      },
                      {
                        pattern: /^1\d{10}$/,
                        message: formatMessage({ id: 'employee.phone.error' }),
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="电子邮箱">
                  {getFieldDecorator('create.email', {
                    rules: [
                      {
                        type: 'email',
                        message: formatMessage({ id: 'employee.email.error' }),
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="职位">{getFieldDecorator('create.job')(<Input />)}</FormItem>
              </Col>

              <Col span={12}>
                <FormItem label="角色">
                  {getFieldDecorator('create.role', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'employee.role.required' }),
                      },
                    ],
                  })(
                    <Select>
                      {roles.map(role => (
                        <Option key={role._id} value={role._id}>
                          {role.name}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>

        <Modal
          title="修改员工信息"
          visible={this.state.openUpdateDialog}
          okText="保存"
          cancelText="取消"
          onOk={this.handleUpdateSubmit}
          onCancel={this.toggleUpdateDialog}
        >
          <Form name="update">
            <Row gutter={12}>
              <Col span={12}>
                <FormItem label="员工姓名">
                  {getFieldDecorator('update.realname', {
                    initialValue: currentEmployee.name,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'employee.realname.required' }),
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label="职位">
                  {getFieldDecorator('update.job', {
                    initialValue: currentEmployee.job,
                  })(<Input />)}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label="角色">
                  {getFieldDecorator('update.role', {
                    initialValue: currentEmployee.role,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'employee.role.required' }),
                      },
                    ],
                  })(
                    <Select>
                      {roles.map(role => (
                        <Option key={role._id} value={role._id}>
                          {role.name}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create<IEmployeeManagerProps>()(EmployeeManager);
