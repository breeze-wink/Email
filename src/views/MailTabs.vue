<template>
    <ion-page>
        <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <ion-tab-bar slot="bottom">
                <ion-tab-button tab="categorizeTab" href="/MailTabs/categorizeTab">
                    <ion-icon :icon="mailOutline" />
                    <ion-label>信箱</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="sendMailTab" href="/MailTabs/sendMailTab">
                    <ion-icon :icon="sendOutline" />
                    <ion-label>发送邮件</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="friendsTab" href="/MailTabs/FriendsTab">
                    <ion-icon :icon="peopleCircleOutline" />
                    <ion-label>好友</ion-label>
                </ion-tab-button>
                  

                <ion-tab-button tab="PersonalInfoTab" href="/MailTabs/PersonalInfoTab">
                    <ion-icon :icon="personCircleOutline" />
                    <ion-label>个人信息</ion-label>
                </ion-tab-button>

                


            </ion-tab-bar>
        </ion-tabs>
    </ion-page>
</template>

<script lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { mailOutline, peopleCircleOutline, personCircleOutline, sendOutline } from 'ionicons/icons';

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
        return {
            mailOutline,
            sendOutline,
            personCircleOutline,
            peopleCircleOutline
        };
    },
};
</script>