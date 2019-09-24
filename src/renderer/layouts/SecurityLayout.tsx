import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { ConnectState, ConnectProps } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import PageLoading from '@/components/PageLoading';

interface SecurityLayoutProps extends ConnectProps {
  loading: boolean;
  currentEnterprise: string;
  currentUser: CurrentUser;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchAfterLogin',
      }).then(() => {
        this.setState({
          isReady: true,
        });
      });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser, currentEnterprise } = this.props;
    // const { enterprises = [] } = currentUser;
    if (loading || !isReady) {
      return <PageLoading />;
    }

    if (!currentEnterprise) {
      return <Redirect to="/enterprise/create"></Redirect>;
    }
    if (!currentUser.id) {
      return <Redirect to="/user/login"></Redirect>;
    }

    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  currentEnterprise: user.currentEnterprise,
  loading: loading.models.user,
}))(SecurityLayout);
