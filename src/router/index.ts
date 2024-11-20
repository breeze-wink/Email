import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/MailTabs.vue';
import LoginTabsPage from '../views/LoginTabsPage.vue';
import AdminTabsPage from '../views/AdminTabs.vue' ;

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
        path: 'friendsTab',
        component: () => import('@/views/FriendsPage.vue')
      },
      
      {
        path: 'PersonalInfoTab',
        component: () => import('@/views/PersonalInfoPage.vue')
      },
      {
        path: 'friendsTab',
        component: () => import('@/views/FriendsPage.vue')
      },
      
      {
        path: 'addFriend',
        component: () => import('@/views/AddFriendPage.vue')

      }
    ]
  },
  {
    path: '/AdminTabs/',
    component: AdminTabsPage,
    children: [
      {
        path: '',
        redirect: '/AdminTabs/setting'
      },
      {
        path: 'outbox',
        component: () => import('@/views/AdminOutboxPage.vue')
      },
      {
        path: 'sendMail',
        component: () => import('@/views/AdminSendPage.vue')
      },
      {
        path: 'users',
        component: () => import('@/views/AdminUsersPage.vue')
      },
      {
        path: 'setting',
        component: () => import('@/views/AdminSettingPage.vue')
      },
      {
        path: 'userDetail',  
       
        component: () => import('@/views/UserDetailPage.vue')
      }
    
    
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
