// store/user.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null as string | null,
    mailId: null as number | null, 
  }),
  actions: {
    setUserId(id: string) {
      this.userId = id;
    },
    setMailId(id: number) { 
      this.mailId = id;
    },
  },
});
