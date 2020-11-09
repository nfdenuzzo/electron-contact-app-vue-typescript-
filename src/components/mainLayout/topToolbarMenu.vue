<template>
  <div class="q-pa-sm q-pl-md row items-center">
    <div class="cursor-pointer non-selectable" @click="checkAutoSaveFeature">
      File
      <q-menu>
        <q-list dense style="min-width: 150px">
          <q-item clickable v-close-popup @click="openFile">
            <q-item-section>Open File</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="displayCreateFilePrompt">
            <q-item-section>New File</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="toggleAutoSave">
            <q-item-section>
              <div class="row no-wrap">
                 Auto Save <q-icon name="done" size="xs" class="q-pl-xl" v-if="autoSaveEnabled" />
              </div>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable v-close-popup @click="closeApp">
            <q-item-section>Quit</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </div>
    <q-dialog
      v-model="viewPasswordPrompt"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <passwordInputPrompt
        ref="newFilePrompt"
        :viewPasswordPrompt.sync="viewPasswordPrompt"
        :selectedFilePath="filePath"
      />
    </q-dialog>

    <q-dialog
      v-model="viewCreateFilePrompt"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <newFilePrompt :viewCreateFilePrompt.sync="viewCreateFilePrompt" />
    </q-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { iFileUploadResponse } from '../models';
export type DataType = {
  viewPasswordPrompt: boolean,
  viewCreateFilePrompt: boolean,
  filePath: string,
  autoSaveEnabled: boolean | null
};

export default Vue.extend({
  name: 'topToolbarMenu',
  components: {
    newFilePrompt: () => import('../dialogs/newFilePrompt.vue'),
    passwordInputPrompt: () => import('../dialogs/passwordInputPrompt.vue')
  },
  data(): DataType {
    return {
      viewPasswordPrompt: false,
      viewCreateFilePrompt: false,
      filePath: '',
      autoSaveEnabled: false
    };
  },
  computed: {},
  methods: {
    checkAutoSaveFeature() {
      this.autoSaveEnabled = this.$q.localStorage.getItem('auto_save');
    },
    toggleAutoSave(): void {
      const autoSaveEnabled: boolean | null = this.$q.localStorage.getItem('auto_save');
      this.$q.localStorage.set('auto_save', !autoSaveEnabled);
    },
    closeApp(): void {
      this.$emit('closeApp');
    },
    openFile(): void {
      this.$q.electron.remote.dialog
        .showOpenDialog({
          properties: ['openFile'],
          filters: [{ name: 'dat', extensions: ['dat'] }]
        })
        .then((resp: iFileUploadResponse | void) => {
          if (resp && !resp.canceled) {
            this.filePath = resp.filePaths[0];
            this.viewPasswordPrompt = true;
          }
        })
        .catch((err: PromiseRejectionEvent) => console.log('errorr', err));
    },
    displayCreateFilePrompt(): void {
      this.viewCreateFilePrompt = true;
    }
  }
});
</script>
