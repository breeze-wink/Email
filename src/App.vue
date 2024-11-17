<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>
<style>
ion-content {
  --background: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);
}
</style>
<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>
