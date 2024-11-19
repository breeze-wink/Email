<template>
    <ion-page>
        <ion-header>
            <ion-toolbar color="dark">
                <ion-title>个人信息</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">个人信息</ion-title>
                </ion-toolbar>
            </ion-header>
            <div class="info-container" v-if="user">
                <ion-item>
                    <ion-label>用户名: </ion-label>
                    <ion-text>{{ user.username }}</ion-text>
                </ion-item>
                <ion-item>
                    <ion-label>邮箱: </ion-label>
                    <ion-text>{{ user.email }}</ion-text>
                </ion-item>
                <ion-item>
                    <ion-label>POP3 服务器: </ion-label>
                    <ion-text>{{ user.pop3Server }}</ion-text>
                </ion-item>
                <ion-item>
                    <ion-label>SMTP 服务器: </ion-label>
                    <ion-text>{{ user.smtpServer }}</ion-text>
                </ion-item>
                <ion-item>
                    <ion-label>POP3 端口: </ion-label>
                    <ion-text>{{ user.pop3Port }}</ion-text>
                </ion-item>
                <ion-item>
                    <ion-label>SMTP 端口: </ion-label>
                    <ion-text>{{ user.smtpPort }}</ion-text>
                </ion-item>
            </div>
            <!-- 退出登录按钮 -->
            <ion-button expand="full" @click="logout" class="logout-button">
                <ion-icon :icon="logOutOutline"></ion-icon>
                退出登录
            </ion-button>

            <!-- 修改密码 -->
            <ion-button id="present-alert" expand="full"  class="change-password-button">
                <ion-icon :icon="keyOutline"></ion-icon>
                修改密码
            </ion-button>

            <ion-alert
                trigger="present-alert"
                header="Please enter your info"
                :buttons="alertButtons"
                :inputs="alertInputs"
            ></ion-alert>



        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonText } from '@ionic/vue';
import { useUserStore } from '@/store/user';
import { ref, onMounted } from 'vue';
import appClient from '@/services/api';
import { useRouter } from 'vue-router';
import { keyOutline, logOutOutline } from 'ionicons/icons'; // 引入 log-out 图标

const userStore = useUserStore();
const router = useRouter();

  const alertInputs = [
    {
        name: 'oldPassword',
        placeholder: 'old password',
        type: 'password', // 添加类型，保证密码输入是隐藏的
    },
    {
        name: 'newPassword',
        placeholder: 'new password',
        type: 'password',
    },
    {
        name: 'confirmPassword',
        placeholder: 'confirm password',
        type: 'password',
    },
  ];

  const alertButtons = [
    {
        text: 'Cancel',
        role: 'cancel',
    },
    {
        text: 'OK',
        handler: async (data: any) => {
            const { oldPassword, newPassword, confirmPassword } = data;

            // 验证输入是否为空
            if (!oldPassword || !newPassword || !confirmPassword) {
                alert('所有字段都是必填项，请填写完整。');
                return false;
            }

            // 验证新密码和确认密码是否相同
            if (newPassword !== confirmPassword) {
                alert('新密码与确认密码不一致，请重新输入。');
                return false;
            }

            // 如果验证通过，调用后端 API 修改密码
            try {
                const response = await appClient.post('/api/user/change-password', {
                    userId: userStore.userId,
                    newPassword: newPassword,
                });

                if (response.status === 200) {
                    alert('密码修改成功！');
                } else {
                    alert('密码修改失败，请重试。');
                }
            } catch (error: any) {
                console.error('修改密码失败', error);
                alert(error.response?.data?.message || '修改密码失败，请重试。');
            }
        },
    },
];

interface User {
    username: string;
    email: string;
    pop3Server: string;
    smtpServer: string;
    pop3Port: number;
    smtpPort: number;
}

const user = ref<User | null>(null);

onMounted(async () => {
    try {
        const response = await appClient.get(`/api/user/${userStore.userId}`);
        if (response.status === 200) {
            user.value = response.data;
        }
    } catch (error: any) {
        console.error('获取用户信息失败', error);
        alert(error.response?.data?.message || '获取用户信息失败请重试。');
    }
});

// 退出登录函数
const logout = () => {
    userStore.$reset(); // 清空用户数据
    router.push('/loginTabs/login'); // 跳转到登录页面
};

</script>

<style scoped>
.info-container {
    padding: 16px;
}

.logout-button {
    padding: 16px;
    --background: #828181;
    /* 覆盖 Ionic 的按钮背景色 */
}

.change-password-button {
    padding: 16px;
    --background: #9aa4e9;
    /* 覆盖 Ionic 的按钮背景色 */
}


</style>
