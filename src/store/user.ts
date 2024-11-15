// store/user.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null as string | null,
  }),
  actions: {
    setUserId(id: string) {
      this.userId = id;
    },
  },
});
