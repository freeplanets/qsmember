import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/login.vue'),
  },
  {
    path: '/Main',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: '/betclass',
        component: () => import('layouts/BetClass.vue'),
      },
      {
        path: '/basepayclass',
        component: () => import('layouts/BasePayClass.vue'),
      },
      {
        path: '/payclass',
        component: () => import('layouts/PayClass.vue'),
      },
      {
        path: '/createpayclass',
        component: () => import('layouts/CreatePayClass.vue'),
      },
      {
        path: '/termsmanager',
        component: () => import('layouts/TermManager.vue'),
      },
      {
        path: '/gamemanager',
        component: () => import('layouts/GameManager.vue'),
      },
      {
        path: '/adduser',
        component: () => import('layouts/UserManager.vue'),
      },
      {
        path: '/openparams',
        component: () => import('layouts/OpenParams.vue'),
      },
      {
        path: '/oddsmanager',
        component: () => import('layouts/OddsManager.vue'),
      },
      {
        path: '/betlists',
        component: () => import('layouts/BetLists.vue'),
      },
      {
        path: '/betreport',
        component: () => import('layouts/BetReport.vue'),
      },
      {
        path: '/probabilitytable',
        component: () => import('layouts/Probability.vue'),
      },
      {
        path: '/btchash',
        component: () => import('layouts/BTCHashDataAna.vue'),
      },
      {
        path: '/itemsmanager',
        component: () => import('pages/ItemsManager.vue'),
      },
      {
        path: '/levermodifier',
        component: () => import('pages/LeverModifier.vue'),
      },
      {
        path: '/cryptoopmanager',
        component: () => import('pages/CryptoOpManager.vue'),
      },
      {
        path: '/cryptoriskcontroller',
        component: () => import('pages/CryptoRiskController.vue'),
      },
      {
        path: '/cryptoreport',
        component: () => import('pages/CryptoReport.vue'),
      },
      {
        path: '/cryptoitemreport',
        component: () => import('pages/CryptoItemReport.vue'),
      },
      {
        path: '/blacklistmanager',
        component: () => import('pages/BlackListManager.vue'),
      },
      {
        path: '/modifytextfile',
        component: () => import('pages/ModifyTextFile.vue'),
      },
      {
        path: '/cryptoledgerreport',
        component: () => import('pages/CryptoLedgerReport.vue'),
      },
      {
        path: '/pfkeymanager',
        component: () => import('pages/PfKeyManager.vue'),
      },
   ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}
export default routes;
