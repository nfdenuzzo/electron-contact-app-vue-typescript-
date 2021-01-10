<template>
  <q-card flat>
    <div class="text-primary">
      <div class="text-weight-bolder q-pa-md text-center text-subtitle1">
        Please enter a password for your new <br />contact data file.
      </div>

      <q-form ref="createForm" v-if="createForm" @submit="confirmCreate">
        <div class="row q-pb-lg q-pt-md justify-center text-caption q-pa-md">
          <div class="row">
            <q-input
              filled
              style="min-width: 220px;"
              :type="viewPassword ? 'password' : 'text'"
              v-model="createForm.password"
              @keydown.enter.prevent="confirmCreate"
              label="Password"
              :rules="[
                val =>
                  (val && val.length > 0 && /\S/.test(val)) ||
                  'Please enter a password!'
              ]"
            >
              <template v-slot:append>
                <q-icon
                  :name="viewPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="viewPassword = !viewPassword"
                />
              </template>
            </q-input>
          </div>
        </div>

        <div class="row justify-center q-pb-md">
          <q-btn
            v-if="!isInitalStartUp || viewCreateFilePrompt"
            label="cancel"
            color="negative"
            class="q-mr-lg text-capitalize"
            @click="closeDialog"
          />
          <q-btn
            label="Proceed"
            type="submit"
            color="positive"
            class="text-capitalize"
            :loading="btnLoading"
          />
        </div>
      </q-form>
    </div>
  </q-card>
</template>

<script lang="ts">
import { QForm } from 'quasar';
import { iCreateFileObject } from '../models';
import { fileCreate } from '../../utils/fileCRUD';
import Vue from 'vue';

export type DataType = {
  btnLoading: boolean;
  viewPassword: boolean;
  createForm: {
    fileName: string;
    password: string;
  };
};

export default Vue.extend({
  name: 'newFilePrompt',
  props: {
    viewCreateFilePrompt: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  components: {},
  data(): DataType {
    return {
      viewPassword: true,
      btnLoading: false,
      createForm: {
        fileName: '',
        password: ''
      }
    };
  },
  computed: {
    isInitalStartUp() {
      if (this.$route.params.firstRun) {
        return true;
      }
      return false;
    }
  },
  methods: {
    confirmCreate(): void {
      this.btnLoading = true;
      let ref: QForm = this.$refs.createForm as QForm;
      ref
        .validate()
        .then(async (success: boolean) => {
          if (success) {
            await this.createFile(this.createForm);
          }
        })
        .catch((err: PromiseRejectionEvent) => console.log('errorr', err))
        .finally(() => {
          this.btnLoading = false;
        });
    },
    closeDialog(): void {
      this.$emit('update:viewCreateFilePrompt', false);
    },
    async createFile(fileProperties: iCreateFileObject): Promise<void> {
      const result = await fileCreate(fileProperties);
      if (result.status === 200) {
        await this.$store.dispatch('clearFileContents')
        await this.$store.dispatch('saveFileContentsOpened', result)
        this.$q.localStorage.remove('previousFileUrl');
        this.$q.localStorage.set('previousFileUrl', result.filePath);
        this.$emit('update:viewCreateFilePrompt', false);
        if (this.$route.path !== '/contacts') {
          await this.$router
            .push('/contacts')
            .catch((err: PromiseRejectionEvent) => {
              console.log('err', err);
            });
        }
      } else {
        this.$q.notify({
          type: 'negative',
          message: result.message,
          timeout: 2800,
          color: 'negative'
        });
      }
    }
  }
});
</script>
