<template>
  <q-card class="scroll full-height text-primary" v-show="isExistingContact || isAddingContact">
    <div
      class="text-weight-bolder q-pb-xs q-pt-xs text-center text-subtitle1 text-primary"
    >
      {{
        isExistingContact ? contactDetailsOriginal.name : 'New Contact Details'
      }}
    </div>
    <q-separator />
    <div class="row q-pa-sm" v-if="isExistingContact">
      <div class="col-xs-12 text-right">
        <span class="q-pr-sm text-caption" v-if="autoSaved">
          Auto Saving..
        </span>
        <span class="q-pr-sm">
          <q-btn
            flat
            round
            :color="!isEditing ? 'warning' : 'grey'"
            :icon="!isEditing ? 'edit' : 'wysiwyg'"
            @click="editContactDetails"
          >
            <q-tooltip>
              {{ !isEditing ? 'Edit Contact' : 'Return to view only' }}
            </q-tooltip>
          </q-btn>
        </span>
        <span>
          <q-btn
            v-if="!isEditingContact"
            flat
            round
            color="negative"
            icon="delete"
            @click="deleteContact"
          >
            <q-tooltip>
              Delete Contact
            </q-tooltip>
          </q-btn>
        </span>
      </div>
    </div>
    <q-form ref="contactForm" :class="{ 'q-pt-lg': isAddingNewContact }">
      <div class="row q-px-md">
        <div
          class="col-xs-3 col-md-2 col-lg-1 text-body2 text-weight-bold q-pr-sm"
          :class="{ 'q-pt-sm': isEditingContact || isAddingNewContact }"
        >
          Name:
        </div>
        <div class="col-xs-9 col-md-6 text-body2 text-weight-bold q-pr-sm">
          <span v-if="!isEditingContact">
            {{ contactDetailsOriginal.name }}
          </span>
          <span v-if="isEditingContact || isAddingNewContact">
            <q-input
              outlined
              dense
              v-model="contactDetails.name"
              lazy-rules
              color="positive"
              :rules="[
                v => !!v || 'Name is required!',
                v => /\S/.test(v) || 'Name is required!'
              ]"
            />
          </span>
        </div>
      </div>
      <div class="row q-px-md q-pt-md">
        <div
          class="col-xs-3 col-md-2 col-lg-1 text-body2 text-weight-bold q-pr-sm"
          :class="{ 'q-pt-sm': isEditingContact || isAddingNewContact }"
        >
          Phone:
        </div>
        <div class="col-xs-9 col-md-6 text-body2 text-weight-bold q-pr-sm">
          <span v-if="!isEditingContact">
            {{ contactDetailsOriginal.phone }}
          </span>
          <span v-if="isEditingContact || isAddingNewContact">
            <q-input
              outlined
              dense
              v-model="contactDetails.phone"
              lazy-rules
              mask="(###) ### - ####"
              color="positive"
              :rules="[
                v => !!v || 'Phone number is required!',
                v => /\S/.test(v) || 'Phone number is required!'
              ]"
            />
          </span>

        </div>
      </div>
      <div class="row q-px-md q-pt-md">
        <div
          class="col-xs-3 col-md-2 col-lg-1 text-body2 text-weight-bold q-pr-sm"
          :class="{ 'q-pt-sm': isEditingContact || isAddingNewContact }"
        >
          Email:
        </div>
        <div class="col-xs-9 col-md-6 text-body2 text-weight-bold q-pr-sm">
          <span v-if="!isEditingContact">
            {{ contactDetailsOriginal.email }}
          </span>
          <span v-if="isEditingContact || isAddingNewContact">
            <q-input
              outlined
              dense
              v-model="contactDetails.email"
              lazy-rules
              color="positive"
              :rules="[
                v => !!v || 'E-mail is required!',
                v => /\S/.test(v) || 'E-mail is required!',
                v =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                  'E-mail must be valid'
              ]"
            />
          </span>
        </div>
      </div>
      <div class="row q-px-md q-pt-md">
        <div
          class="col-xs-3 col-md-2 col-lg-1 text-body2 text-weight-bold q-pr-sm"
          :class="{ 'q-pt-sm': isEditingContact || isAddingNewContact }"
        >
          Address:
        </div>
        <div class="col-xs-9 col-md-6 text-body2 text-weight-bold q-pr-sm">
          <span v-if="!isEditingContact">
            {{ contactDetailsOriginal.address }}
          </span>
          <span v-if="isEditingContact || isAddingNewContact">
            <q-input
              outlined
              dense
              v-model="contactDetails.address"
              type="textarea"
              lazy-rules
              color="positive"
              :rules="[
                v => !!v || 'Address is required!',
                v => /\S/.test(v) || 'Address is required!'
              ]"
            />
          </span>
        </div>
      </div>
    </q-form>
    <div class="row q-py-md" v-if="isEditingContact || isAddingNewContact">
      <div class="col-xs-12 col-md-10 col-lg-8 text-center">
        <q-btn
          label="Save Contact"
          color="positive"
          :loading="btnLoading"
          class="q-mr-lg text-capitalize"
          @click="saveContact"
        />
      </div>
    </div>

    <q-dialog
      v-model="viewDeleteConfirmationPrompt"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <deleteConfirmationPrompt
        v-if="viewDeleteConfirmationPrompt"
        @confirmDelete="confirmDelete"
        :viewDeleteConfirmationPrompt.sync="viewDeleteConfirmationPrompt"
        :confirmBtnLoading.sync="confirmBtnLoading"
      />
    </q-dialog>
  </q-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { iContactStructure } from '../../store/types';
import { fileUpdate } from '../../utils/fileCRUD';
import _ from 'lodash';
import { uid } from 'quasar';
import { QForm } from 'quasar';
export type DataType = {
  btnLoading: boolean;
  isEditing: boolean;
  contactDetails: iContactStructure;
  viewDeleteConfirmationPrompt: boolean;
  confirmBtnLoading: boolean;
  autoSaveCountDownStarted: boolean;
  autoSaved: boolean;
  autoSaveTimer: any
};

export default Vue.extend({
  name: 'contactsList',
  components: {
    deleteConfirmationPrompt: () =>
      import('../dialogs/deleteConfirmationPrompt.vue')
  },
  props: {
    contactDetailsOriginal: {
      type: Object as PropType<iContactStructure>,
      required: false
    },
    isAddingContact: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data(): DataType {
    return {
      autoSaveTimer: 0,
      autoSaved: false,
      autoSaveCountDownStarted: false,
      viewDeleteConfirmationPrompt: false,
      confirmBtnLoading: false,
      btnLoading: false,
      isEditing: false,
      contactDetails: {
        id: uid(),
        name: '',
        phone: '',
        address: '',
        email: ''
      }
    };
  },
  mounted() {
    this.setReadOnlyView();
  },
  beforeDestroy() {
    this.setReadOnlyView();
  },
  watch: {
    contactDetailsOriginal() {
      this.setReadOnlyView();
    },
    isAddingNewContact(): void {
      if (this.isAddingContact) {
        this.restartAutoSaveTimer();
        this.autoSaveCountDownStarted = true;
        this.contactDetails = {
          id: uid(),
          name: '',
          phone: '',
          address: '',
          email: ''
        };
      }
    }
  },
  computed: {
    isAddingNewContact(): boolean {
      return this.isAddingContact;
    },
    isEditingContact(): boolean {
      return this.isEditing;
    },
    isExistingContact(): boolean {
      if (!_.isEmpty(this.contactDetailsOriginal)) {
        return true;
      }
      return false;
    }
  },
  methods: {
    restartAutoSaveTimer(): void {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = <any>setInterval(async () => {
        await this.autoSaveDetails();
      }, 60000);
    },
    setReadOnlyView(): void {
      if (this.contactDetailsOriginal.id !== this.contactDetails.id) {
        this.autoSaveCountDownStarted = false;
        clearInterval(this.autoSaveTimer);
        this.autoSaveTimer = null;
        this.isEditing = false;
      }
    },
    deleteContact(): void {
      this.viewDeleteConfirmationPrompt = true;
    },
    async confirmDelete(): Promise<void> {
      await this.$store.dispatch('deleteContact', this.contactDetailsOriginal);
      const autoSaving = false;
      await this.contactCreateUpdate(autoSaving);
      this.confirmBtnLoading = false;
      this.viewDeleteConfirmationPrompt = false;
      clearInterval(this.autoSaveTimer);
      this.$emit('deletedContact')
    },
    saveContact(): void {
      this.btnLoading = true;
      let ref: QForm = this.$refs.contactForm as QForm;
      ref
        .validate()
        .then(async (success: boolean) => {
          if (success) {
            if (this.isAddingNewContact) {
              await this.$store.dispatch('createContact', this.contactDetails);
            } else {
              await this.$store.dispatch('updateContact', this.contactDetails);
            }
            const autoSaving = false;
            await this.contactCreateUpdate(autoSaving);
          }
        })
        .catch((err: PromiseRejectionEvent) => console.log('errorr', err))
        .finally(() => {
          this.btnLoading = false;
        });
    },
    async contactCreateUpdate(autoSaving: boolean): Promise<void> {
      /* eslint-disable @typescript-eslint/no-unsafe-member-access */
      const result = await fileUpdate(
        this.$store.getters.getFilePath,
        this.$store.getters.getfilePassword,
        this.$store.getters.getFileContents
      );
      if (result && result.status === 200) {
        await this.$store.dispatch('saveFileContents', result)
        if (!autoSaving) {
          if (this.isAddingNewContact || this.isEditingContact) {
            this.$emit('contactCreatedUpdated', this.contactDetails.id);
            this.isEditing = false;
          } else {
            this.$emit('contactDeleted');
          }
        }
      } else {
        this.$q.notify({
          type: 'negative',
          message: result.message,
          color: 'negative'
        });
      }
    },
    editContactDetails(): void {
      if (!this.isEditing) {
        this.isEditing = true;
        this.restartAutoSaveTimer();
        this.autoSaveCountDownStarted = true;
        this.contactDetails = JSON.parse(
          JSON.stringify(this.contactDetailsOriginal)
        );
      } else {
        this.isEditing = false;
      }
    },
    changesOccured(): boolean {
      if (this.isEditingContact) {
        if (_.isEqual(this.contactDetailsOriginal, this.contactDetails)) {
          return false;
        }
        return true;
      } else if (this.isAddingNewContact) {
        return true;
      } else {
        return false;
      }
    },
    autoSaveDetails: async function(): Promise<void> {
      if (this.autoSaveCountDownStarted) {
        if (this.$q.localStorage.getItem('auto_save')) {
          const autoSaving = true;
          if (this.contactDetails && this.contactDetails.name) {
            if (this.isAddingNewContact) {
              await this.$store.dispatch('createContact', this.contactDetails);
              this.isEditing = true;
              this.$emit('update:isAddingContact', false);
            } else {
              await this.$store.dispatch('updateContact', this.contactDetails);
            }
            await this.contactCreateUpdate(autoSaving);
            this.$emit('updateOriginalContactDetails', this.contactDetails.id);
            this.autoSaved = true;
            setTimeout(() => {
              this.autoSaved = false;
            }, 3000);
          }
        }
      }
    }
  }
});
</script>
