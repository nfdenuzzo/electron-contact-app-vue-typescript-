<template>
  <q-bar class="q-electron-drag">
    <q-icon name="lock" />
    <div>SSC Manager</div>
    <q-space />

    <q-btn dense flat icon="minimize" @click="minimize" />
    <q-btn dense flat icon="crop_square" @click="maximize" />
    <q-btn dense flat icon="close" @click="closeApp" />
  </q-bar>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'topToolbar',
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
    minimize(): void {
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow()?.minimize();
      }
    },
    maximize(): void {
      if (process.env.MODE === 'electron') {
        const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow();
        if (win?.isMaximized()) {
          win.unmaximize();
        } else {
          win?.maximize();
        }
      }
    },
    closeApp(): void {
      // we clear the file details when exiting the app user will need to re enter password on next startup
      this.$store
        .dispatch('clearFileDetails')
        .catch((err: PromiseRejectionEvent) => {
          console.log('err', err);
        });
      this.$router.push('/startup').catch((err: PromiseRejectionEvent) => {
        console.log('err', err);
      });
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow()?.close();
      }
    }
  }
});
</script>
