<template>
  <div class="row q-pa-sm">
    <div class="col-xs-4 col-lg-3 q-pr-sm" :key="$store.getters.getFilePath">
      <contactsList
        @displayContactInfo="displayContactInfo"
        :isAddingContact="isAddingContact"
        :selectedContactId="selectedContactId"
        :isViewingContact="isViewingContact"
        :style="$q.screen.lt.md ? 'min-height: 75vh;' : 'min-height: 85vh;'"
      />
      <div class="row text-primary text-caption q-pt-xs">
        Contact Count: {{ getContactListCount }}
      </div>
      <div class="row q-pt-xs justify-center">
        <q-btn
          label="Add Contact"
          color="positive"
          class="q-mr-lg text-capitalize"
          @click="createNewContact"
        />
      </div>
    </div>
    <div
      class="col-xs-8 col-lg-9"
      :style="$q.screen.lt.md ? 'min-height: 86vh;' : 'min-height: 90vh;'"
    >
      <contactDetailsDisplay
        ref="contactDetailsDisplay"
        @contactDeleted="contactDeleted"
        @contactCreatedUpdated="contactCreatedUpdated"
        @deletedContact="deletedContact"
        @updateOriginalContactDetails="updateOriginalContactDetails"
        :contactDetailsOriginal="contactDetailsOriginal"
        :isAddingContact.sync="isAddingContact"
      />
    </div>

    <q-dialog
      v-model="viewUnsavedChangesPrompt"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <unsavedChangesPrompt
        :viewUnsavedChangesPrompt.sync="viewUnsavedChangesPrompt"
        @confirmDiscard="confirmDiscard"
      />
    </q-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { iContactStructure } from '../store/types';
export type DataType = {
  contactDetailsOriginal: iContactStructure;
  isViewingContact: boolean;
  isAddingContact: boolean;
  selectedContactId: string;
  newContactIdSelected: string;
  viewUnsavedChangesPrompt: boolean;
};
export default Vue.extend({
  name: 'contactsDisplay',
  components: {
    contactsList: () =>
      import('../components/contactsDisplay/contactsList.vue'),
    contactDetailsDisplay: () =>
      import('../components/contactsDisplay/contactDetailsDisplay.vue'),
    unsavedChangesPrompt: () =>
      import('../components/dialogs/unsavedChangesPrompt.vue')
  },
  data() {
    return {
      contactDetailsOriginal: {},
      isViewingContact: false,
      isAddingContact: false,
      selectedContactId: '',
      newContactIdSelected: '',
      viewUnsavedChangesPrompt: false
    };
  },
  watch: {
    '$store.getters.getFilePath'(newValue: string, oldValue: string) {
      if (newValue !== oldValue) {
        this.isAddingContact = false;
        this.isViewingContact = false;
      }
    }
  },
  computed: {
    getContactListCount(): number {
      /* eslint-disable @typescript-eslint/no-unsafe-member-access */
      // unfortunately -> vue 2 and options API + eslint does not like the store being imported globally as it is declared Store<any>
      return this.$store.getters.getFileContents
        ? (this.$store.getters.getFileContents.length as number)
        : 0;
    }
  },
  methods: {
    contactDeleted(): void {
      this.isViewingContact = false;
    },
    contactCreatedUpdated(contactId: string): void {
      this.isAddingContact = false;
      this.isViewingContact = true;
      this.contactDetailsOriginal = this.$store.getters.getFileContents.find(
        (contact: iContactStructure) => {
          return contact.id === contactId;
        }
      ) as iContactStructure;
      this.selectedContactId = contactId;
    },
    updateOriginalContactDetails(contactId: string): void {
      this.contactDetailsOriginal = this.$store.getters.getFileContents.find(
        (contact: iContactStructure) => {
          return contact.id === contactId;
        }
      ) as iContactStructure;
      this.selectedContactId = contactId;
    },
    deletedContact() {
      this.contactDetailsOriginal = {};
      this.isViewingContact = false;
    },
    createNewContact(): void {
      this.isAddingContact = true;
      this.contactDetailsOriginal = {};
    },
    displayContactInfo(contactId: string): void {
      if (!this.$refs.contactDetailsDisplay) {
        this.viewContactDetails(contactId);
      } else if (
        this.$refs.contactDetailsDisplay &&
        !(this.$refs.contactDetailsDisplay as Vue & { changesOccured: () => boolean }).changesOccured()
      ) {
        this.viewContactDetails(contactId);
      } else if ((this.$refs.contactDetailsDisplay as Vue & { changesOccured: () => boolean }).changesOccured()) {
        this.viewUnsavedChangesPrompt = true;
        this.newContactIdSelected = contactId;
      }
    },
    confirmDiscard() {
      this.viewUnsavedChangesPrompt = false;
      this.viewContactDetails(this.newContactIdSelected);
    },
    viewContactDetails(contactId: string): void {
      this.contactDetailsOriginal = this.$store.getters.getFileContents.find(
        (contact: iContactStructure) => {
          return contact.id === contactId;
        }
      );
      this.isViewingContact = true;
      this.isAddingContact = false;
      this.selectedContactId = contactId;
    }
  }
});
</script>
