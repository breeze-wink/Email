import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/MailTabs.vue';
import LoginTabsPage from '../views/LoginTabsPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/loginTabs/login'
  },
  {
    path: '/loginTabs/',
    component: LoginTabsPage,
    children: [
      {
        path: '',
        redirect: '/loginTabs/login'
      },
      {
        path: 'login',
        component: () => import('@/views/LoginPage.vue')
      },
      {
        path: 'register',
        component: () => import('@/views/RegisterPage.vue')
      }
    ]
  },
  {
    path: '/MailTabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/MailTabs/categorizeTab'
      },
      {
        path: 'categorizeTab',
        component: () => import('@/views/Categorize.vue')
      },
      {
        path: 'mailTab',
        component: () => import('@/views/MailPage.vue')
      },
      {
        path: 'mailDetail',
        component: () => import('@/views/MailDetailPage.vue')
      },
      {
        path: 'drafts',
        component: () => import('@/views/DraftsPage.vue')
      },
      {
        path: 'draftsDetail',
        component: () => import('@/views/DraftsDetailPage.vue')
      },
      {
        path: 'trash',
        component: () => import('@/views/TrashPage.vue')
      },
      {
        path: 'trashDetail',
        component: () => import('@/views/TrashDetailPage.vue')
      },
      {
        path: 'outbox',
        component: () => import('@/views/OutboxPage.vue')
      },
      {
        path: 'outboxDetail',
        component: () => import('@/views/OutboxDetailPage.vue')
      },








      {
        path: 'sendMailTab',
        component: () => import('@/views/SendMailPage.vue')
      },
      {
        path: 'PersonalInfoTab',
        component: () => import('@/views/PersonalInfoPage.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
