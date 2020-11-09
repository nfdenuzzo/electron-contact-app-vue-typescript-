<template>
  <div>
    <q-layout view="lHh lpr lFf">
      <q-header elevated>
        <topToolBar @closeApp="closeApp" ref="topToolBar" />
        <topToolbarMenu @closeApp="closeApp" />
      </q-header>

      <q-page-container>
        <transition name="component-fade" mode="out-in">
          <router-view />
        </transition>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { isFirstRunResult } from '../store/types';
export default Vue.extend({
  name: 'MainLayoutElectron',
  components: {
    topToolBar: () => import('../components/mainLayout/topToolbar.vue'),
    topToolbarMenu: () => import('../components/mainLayout/topToolbarMenu.vue')
  },
  data() {
    return {};
  },
  async created(): Promise<void> {
    await this.isFirstRun();
  },
  methods: {
    async isFirstRun(): Promise<void> {
      const result: isFirstRunResult = await this.$q.electron.ipcRenderer.invoke(
        'is-first-run'
      );
      if (result.isFirstRun) {
        const firstRun: string = result.isFirstRun.toString();
        this.$q.localStorage.set('auto_save', true);
        this.$router
          .push({ name: 'initialStartup', params: { firstRun } })
          .catch((err: PromiseRejectionEvent) => {
            console.log('err', err);
          });
      } else {
        this.$router.push('/startup').catch((err: PromiseRejectionEvent) => {
          console.log('err', err);
        });
      }
    },
    closeApp(): void {
      (this.$refs.topToolBar as Vue & { closeApp: () => void }).closeApp();
    }
  }
});
</script>
