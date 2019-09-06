import { IRoute } from "umi-types";

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
            icon: 'smile',
            component: './Welcome',
          },
          {
            path: '/enterprise/',
            name: 'enterprise',
            exact: false,
            hideInMenu: false,
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
            routes: [
              {
                path: '/product/add',
                name: 'add',
                icon: 'block',
                component: './product/add',
              },
              {
                path: '/product/query',
                name: 'query',
                icon: 'block',
                component: './product/query',
              }
            ],
          },
          {
            path: '/stock/',
            name: 'stock',
            icon: 'stock',
            exact: false,
            routes: [
              {
                path: '/stock/instock',
                name: 'instock',
                icon: 'block',
                component: './stock/instock',
              },
              {
                path: '/stock/outstock',
                name: 'outstock',
                icon: 'block',
                component: './stock/outstock',
              },
              {
                path: '/stock/query',
                name: 'query',
                icon: 'block',
                component: './stock/query',
              },
            ]
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