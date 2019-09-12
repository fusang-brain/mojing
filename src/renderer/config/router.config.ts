import { IRoute } from 'umi-types';

export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        // authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/welcome',
          },
          {
            path: '/welcome',
            name: 'welcome',
            icon: 'icon-home',
            component: './Welcome',
          },
          {
            path: '/enterprise/',
            name: 'enterprise',
            exact: false,
            hideInMenu: true,
            routes: [
              {
                path: '/enterprise/create',
                name: 'create',
                icon: 'block',
                component: './enterprise/create',
              },
            ],
          },
          {
            path: '/product/',
            name: 'product',
            exact: false,
            icon: 'icon-list',
            routes: [
              {
                path: '/product/add',
                name: 'add',
                icon: 'icon-touch',
                component: './product/add',
              },
              {
                path: '/product/query',
                name: 'query',
                icon: 'icon-touch',
                component: './product/query',
              },
            ],
          },
          {
            path: '/finance/',
            name: 'finance',
            exact: false,
            icon: 'icon-finance',
            component: './finance/',
          },
          {
            path: '/stock/',
            name: 'stock',
            icon: 'icon-stock',
            exact: false,
            routes: [
              {
                path: '/stock/instock',
                name: 'instock',
                icon: 'icon-touch',
                component: './stock/instock',
              },
              {
                path: '/stock/outstock',
                name: 'outstock',
                icon: 'icon-touch',
                component: './stock/outstock',
              },
              {
                path: '/stock/query',
                name: 'query',
                icon: 'icon-touch',
                component: './stock/query',
              },
            ],
          },
          {
            path: '/member',
            name: 'member',
            exact: false,
            icon: 'icon-member',
            component: './member',
          },
          {
            path: '/setting',
            name: 'setting',
            exact: false,
            icon: 'icon-setting',
            component: './setting',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },

  {
    component: './404',
  },
] as IRoute[];
