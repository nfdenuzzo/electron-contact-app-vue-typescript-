<template>
  <q-card flat>
    <div class="text-primary">
      <div
        class="text-weight-bolder q-pb-xs q-pt-md text-center text-subtitle1"
      >
        {{
          viewPasswordPrompt
            ? 'Password Required.'
            : 'Please enter the password for your contact data file.'
        }}
      </div>

      <q-form ref="passwordForm" v-if="passwordForm" @submit="confirmPassword">
        <div class="row q-pb-lg q-pt-md justify-center text-caption q-pa-md">
          <q-form ref="passwordForm" v-if="passwordForm">
            <q-input
              :type="viewPassword ? 'password' : 'text'"
              filled
              style="min-width: 220px;"
              v-model="passwordForm.password"
              @keydown.enter.prevent="confirmPassword"
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
          </q-form>
        </div>

        <div class="row justify-center q-pb-md">
          <q-btn
            v-if="viewPasswordPrompt"
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
import { fileOpen } from '../../utils/fileCRUD';
import Vue from 'vue';

export type DataType = {
  btnLoading: boolean;
  viewPassword: boolean;
  passwordForm: {
    password: string;
  };
};

export default Vue.extend({
  name: 'passwordInputPrompt',
  props: {
    viewPasswordPrompt: {
      type: Boolean,
      required: false,
      default: false
    },
    selectedFilePath: {
      type: String,
      required: false,
      default: ''
    }
  },
  components: {},
  data(): DataType {
    return {
      btnLoading: false,
      viewPassword: true,
      passwordForm: {
        password: ''
      }
    };
  },
  methods: {
    confirmPassword(): void {
      this.btnLoading = true;
      let ref: QForm = this.$refs.passwordForm as QForm;
      ref
        .validate()
        .then(async (success: boolean) => {
          if (success) {
            await this.passwordSuppliedOpenFile(this.passwordForm.password);
          } else {
            this.$q.notify({
              type: 'negative',
              message: 'Password is invalid!',
              color: 'negative'
            });
          }
          this.btnLoading = false;
        })
        .catch((err: PromiseRejectionEvent) => console.log('errorr', err))
        .finally(() => {
          this.btnLoading = false;
        });
    },
    async passwordSuppliedOpenFile(password: string): Promise<void> {
      /* eslint-disable @typescript-eslint/no-unsafe-member-access */
      const filePath: string | null = this.selectedFilePath
        ? this.selectedFilePath
        : this.$q.localStorage.getItem('previousFileUrl');
      const result = await fileOpen(filePath, password);
      if (result && result.status === 200) {
        await this.$store.dispatch('saveFileContentsOpened', result)
        this.$q.localStorage.remove('previousFileUrl');
        this.$q.localStorage.set('previousFileUrl', result.filePath);
        this.$emit('update:viewPasswordPrompt', false);
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
          color: 'negative'
        });
      }
    },
    closeDialog(): void {
      this.$emit('update:viewPasswordPrompt', false);
    }
  }
});
</script>
