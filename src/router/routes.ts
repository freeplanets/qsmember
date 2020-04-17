import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: '/login',
        component: () => import('layouts/login.vue')
      },
      {
        path: '/betclass',
        component: () => import('layouts/BetClass.vue')
      },
      {
        path: '/basepayclass',
        component: () => import('layouts/BasePayClass.vue')
      },
      {
        path: '/payclass',
        component: () => import('layouts/PayClass.vue')
      },
      {
        path: '/createpayclass',
        component: () => import('layouts/CreatePayClass.vue')
      },
      {
        path: '/termsmanager',
        component: () => import('layouts/TermManager.vue')
      },
      {
        path: '/gamemanager',
        component: () => import('layouts/GameManager.vue')
      },
      {
        path: '/adduser',
        component: () => import('layouts/UserManager.vue')
      }, 
      {
        path: '/openparams',
        component: () => import('layouts/OpenParams.vue')
      },
      {
        path: '/oddsmanager',
        component: () => import('layouts/OddsManager.vue')
      },                    
    ],
  }

];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
