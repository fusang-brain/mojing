/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import Link from 'umi/link';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
// import { isAntDesignPro } from '@/utils/utils';
import logo from '../assets/logo.svg';
import { defaultRenderLogo } from '@ant-design/pro-layout/lib/SiderMenu/SiderMenu';
import { Button, Icon } from 'antd';
import { isBrowser } from '@/utils/utils';
import styles from './BasicLayout.less';

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  settings: Settings;
  dispatch: Dispatch;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

/**
 * use Authorized check all menu item
 */
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map(item => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : [],
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const headerRender = (
  triggerResizeEvent: () => void,
): BasicLayoutProps['headerRender'] => props => {
  const defaultRenderCollapsedButton = (collapsed?: boolean) => (
    <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
  );

  const {
    isMobile,
    logo: theLogo,
    rightContentRender,
    collapsed,
    collapsedButtonRender = defaultRenderCollapsedButton,
    onCollapse,
    menuRender,
  } = props;

  const toggle = () => {
    if (onCollapse) onCollapse(!collapsed);
    triggerResizeEvent();
  };

  const renderCollapsedButton = () => {
    if (collapsedButtonRender !== false && menuRender !== false) {
      return (
        <div className={styles.collapsedButton} onClick={toggle}>
          {collapsedButtonRender(collapsed)}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="ant-pro-global-header">
      {isMobile && (
        <a className="ant-pro-global-header-logo" key="logo">
          {defaultRenderLogo(theLogo)}
        </a>
      )}
      {renderCollapsedButton()}
      {rightContentRender && rightContentRender(props)}
    </div>
  );
};

const collapsedButtonRender: BasicLayoutProps['collapsedButtonRender'] = collapsed => {
  return <Button type="primary" icon={!collapsed ? 'arrow-left' : 'arrow-right'} />;
};

const footerRender: BasicLayoutProps['footerRender'] = (_, defaultDom) => {
  // console.log(defaultDom, 'defaultDom');
  // if (!isAntDesignPro()) {
  //   return defaultDom;
  // }
  // return (
  //   <>
  //     {defaultDom}
  //     {/* <div
  //       style={{
  //         padding: '0px 24px 24px',
  //         textAlign: 'center',
  //       }}
  //     >
  //       <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
  //         <img
  //           src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
  //           width="82px"
  //           alt="netlify logo"
  //         />
  //       </a>
  //     </div> */}
  //   </>
  // );
  return <></>;
};

class BasicLayout extends Component<BasicLayoutProps> {
  triggerResizeEvent = debounce(() => {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    if (isBrowser()) {
      window.dispatchEvent(event);
    }
  });

  componentWillUnmount(): void {
    this.triggerResizeEvent.cancel();
  }

  render() {
    const { dispatch, children, settings } = this.props;
    /**
     * init variables
     */
    const handleMenuCollapse = (payload: boolean): void => {
      if (dispatch) {
        dispatch({
          type: 'global/changeLayoutCollapsed',
          payload,
        });
      }
    };

    return (
      <ProLayout
        logo={logo}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl) {
            return defaultDom;
          }
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
              defaultMessage: 'Home',
            }),
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        // fixSiderbar
        // fixedHeader={true}
        iconfontUrl="https://at.alicdn.com/t/font_1401573_4gjpa81vvnx.js"
        headerRender={headerRender(this.triggerResizeEvent)}
        collapsedButtonRender={collapsedButtonRender}
        footerRender={footerRender}
        menuDataRender={menuDataRender}
        formatMessage={formatMessage}
        rightContentRender={rightProps => <RightContent {...rightProps} />}
        {...this.props}
        {...settings}
      >
        {children}
      </ProLayout>
    );
  }
}

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
