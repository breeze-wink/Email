<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>用户管理</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">用户管理</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- 搜索框和搜索按钮 -->
      <div class="search-container">
        <ion-searchbar v-model="searchQuery" placeholder="输入用户名或邮箱地址" />
        <ion-button @click="searchUsers" color="primary">搜索</ion-button>
      </div>

      <!-- 用户列表 -->
      <ion-list  :inset="true" style="background-color: transparent;">
        <ion-item v-for="user in users" :key="user.id">
          <ion-label>
            <h2>{{ user.username }}</h2>
            <p>{{ user.email }}</p>
          </ion-label>
            <ion-button @click="viewUserDetail(user.id)" color="primary" slot="end">详情</ion-button>
            <ion-button @click="adjustUserPermissions(user.id, user.username)" color="tertiary" slot="end">调整权限</ion-button>
            <ion-button @click="deleteUser(user.id)" color="danger" slot="end">删除用户</ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/vue';
import { ref, onMounted } from 'vue';
import apiClient from '@/services/api';
import { alertController } from '@ionic/vue';
import { useRouter } from 'vue-router';

// 定义用户信息类型
interface User {
  id: number;
  username: string;
  email: string;
}

// 使用 Pinia 的用户存储（可选，若需要用到用户数据可共享到其他组件）
const users = ref<User[]>([]);
const searchQuery = ref<string>('');
const router = useRouter();

// 获取所有用户列表
const fetchAllUsers = async () => {
  try {
    const response = await apiClient.get<User[]>('/api/administrator/get-all-uses');
    if (response.status === 200) {
      users.value = response.data;
    }
  } catch (error) {
    console.error('获取用户列表失败', error);
    await showAlert('错误', (error as any).response?.data?.message || '获取用户列表失败，请重试。');

  }
};

// 搜索用户函数
const searchUsers = async () => {
  if (!searchQuery.value.trim()) {
    // 如果搜索框为空，显示所有用户
    await fetchAllUsers();
    return;
  }


  try {
    // 调用后端搜索接口实现模糊匹配
    const response = await apiClient.get<User[]>('/api/administrator/search-users', {
      params: { query: searchQuery.value }
    });
    if (response.status === 200) {
      users.value = response.data;
    }
  } catch (error) {
    console.error('搜索用户失败', error);
    await showAlert('错误', (error as any).response?.data?.message || '搜索用户失败，请重试。');
  }
  
  
};

// 初次加载页面时获取所有用户
onMounted(() => {
  fetchAllUsers();
});

const viewUserDetail = (userId: number) => {
  console.log(userId);
  router.push({
  path: `/AdminTabs/userDetail/${userId}`

});
};

// 调整权限函数（可以按需实现逻辑）
// 调整权限函数
const adjustUserPermissions = async (userId: number, username: string) => {
  let permission = 0;
  const alert = await alertController.create({
    header: '调整权限',
    message: `用户名: ${username}`,
    inputs: [
      {
        name: 'sendPermission',
        type: 'checkbox',
        label: '发件',
        value: 'send',
      },
      {
        name: 'receivePermission',
        type: 'checkbox',
        label: '收件',
        value: 'receive',
      },
    ],
    buttons: [
      {
        text: '取消',
        role: 'cancel',
      },
      {
        text: '确认',
        handler: async (data: any) => {
          if (data.includes('send')) {
            permission += 1;
          }
          if (data.includes('receive')) {
            permission += 2;
          }
          try {
            const response = await apiClient.put('/api/administrator/update-permission', {
              id: userId,
              permission: permission,
            });
            if (response.status === 200) {
              await showAlert('成功', '权限更新成功！');
            }
          } catch (error: any) {
            console.error('更新用户权限失败', error);
            await showAlert('错误', error.response?.data?.message || '更新用户权限失败，请重试。');
          }
        },
      },
    ],
  });
  await alert.present();
};

// 删除用户函数
const deleteUser = async (userId: number) => {
try {
  const response = await apiClient.delete(`/api/administrator/delete-user/${userId}`);

  if (response.status === 200) {
    users.value = users.value.filter(user => user.id !== userId);
    await showAlert('成功', '用户删除成功！');
  }
} catch (error: any) {
  console.error('删除用户失败', error);
  await showAlert('错误', error.response?.data?.message || '删除用户失败，请重试。');
}
};

// 显示错误弹窗
const showAlert = async (header: string, message: string) => {
  const alert = await alertController.create({
    header,
    message,
    buttons: ['确认'],
  });
  await alert.present();
};
</script>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  padding: 16px;
}

ion-searchbar {
  flex: 1;
  margin-right: 8px;
}

ion-button {
  --border-radius: 8px;
}
</style>
