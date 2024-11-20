<template>
    <ion-page>
        <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <ion-tab-bar slot="bottom">
                <ion-tab-button tab="categorizeTab" href="/AdminTabs/outbox">
                    <ion-icon :icon="mailOutline" />
                    <ion-label>发件箱</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="sendMailTab" href="/AdminTabs/sendMail">
                    <ion-icon :icon="sendOutline" />
                    <ion-label>发送邮件</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="friendsTab" href="/AdminTabs/users">
                    <ion-icon :icon="peopleCircleOutline" />
                    <ion-label>用户</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="PersonalInfoTab" href="/AdminTabs/setting">
                    <ion-icon :icon="settingsOutline" />
                    <ion-label>设置</ion-label>
                </ion-tab-button>

            </ion-tab-bar>
        </ion-tabs>
    </ion-page>
</template>

<script lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { mailOutline, peopleCircleOutline, personCircleOutline, sendOutline, settingsOutline} from 'ionicons/icons';
import { useUserStore } from '@/store/user';

export default {
    name: 'Tabs',
    components: {
        IonLabel,
        IonTabs,
        IonTabBar,
        IonTabButton,
        IonIcon,
        IonPage,
        IonRouterOutlet,
    },
    setup() {
        const userStore = useUserStore();

        return {
            mailOutline,
            sendOutline,
            personCircleOutline,
            peopleCircleOutline,
            userStore,
            settingsOutline
        };
    },
};
</script>