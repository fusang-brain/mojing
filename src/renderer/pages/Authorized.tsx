import React from 'react';
import Redirect from 'umi/redirect';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
import Authorized from '@/utils/Authorized';
import { ConnectProps, ConnectState, Route, UserModelState } from '@/models/connect';

interface AuthComponentProps extends ConnectProps {
  user: UserModelState;
}

const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  // console.log()
  routeData.forEach(route => {
    // match prefix
    if (pathToRegexp(`${route.path}(.*)`).test(path)) {
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  // console.log()
  return authorities;
};

const AuthComponent: React.FC<AuthComponentProps> = ({
  children,
  route = {
    routes: [],
  },
  location = {
    pathname: '',
  },
  user,
}) => {
  const { currentUser } = user;
  const { routes = [] } = route;
  // console.log(routes, 'routes');
  // console.log(currentUser,' == currentUser ==');
  const isLogin = currentUser && currentUser.id;
  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routes) || ''}
      noMatch={isLogin ? <Redirect to="/exception/403" /> : <Redirect to="/user/login" />}
    >
      {children}
    </Authorized>
  );
};

export default connect(({ user }: ConnectState) => ({
  user,
}))(AuthComponent);
