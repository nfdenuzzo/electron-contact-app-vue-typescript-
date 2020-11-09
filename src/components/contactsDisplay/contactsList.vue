<template>
  <q-card>
    <div
      class="text-weight-bolder q-py-xs text-center text-subtitle1 text-primary thick-border"
    >
      Contacts List
    </div>
    <q-separator />
    <div class="text-weight-medium text-left text-subtitle2 text-primary">
      <div class="row q-pb-sm">
        <div
          class="col-xs-12 col-sm-12 col-md-6 block"
          style="background:rgba(0, 0, 0, 0.05);"
        >
          <q-btn-dropdown
            dense
            color="grey"
            :label="`Filter: ${filterSelection}`"
            class="text-capitalize full-width full-height"
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                @click="onItemClick(filterName)"
                v-for="(filterName, index) in getFilterOptions.filter(x => x !== 'id')"
                :key="index"
              >
                <q-item-section>
                  <q-item-label class="text-capitalize" >{{
                    filterName
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6">
          <q-input
            filled
            dense
            standout
            v-model="filterString"
            input-class="text-right"
            :placeholder="`Search`"
            class="full-width"
          >
            <template v-slot:append>
              <q-icon v-if="filterString === ''" name="search" />
              <q-icon
                v-else
                name="clear"
                class="cursor-pointer"
                @click="filterString = ''"
              />
            </template>
          </q-input>
        </div>
      </div>
      <div
        class="scroll q-pt-xs"
        :style="$q.screen.lt.md ? 'max-height: 60vh;' : 'max-height: 77vh;'"
      >
        <div
          v-if="contactDetailsSimplified.length === 0"
          class="q-pa-sm text-weight-medium"
        >
          {{
            filterString ? 'No Matching Records Found' : 'No Contacts Found!'
          }}
        </div>
        <div
          class="row"
          v-for="(contact, index) in contactDetailsSimplified"
          :key="index"
        >
          <div
            class="col-xs-12 q-pl-xs q-py-sm q-pa-sm cursor-pointer my-hover-shadow"
            :class="{
              'current-contact-active': selectedContactId === contact.id
            }"
            @click="displayContactInfo(contact.id)"
          >
            <div class="row">
              {{ contact.name }}
            </div>
            <div class="row text-caption" v-if="filterSelection === 'email'">
              <span class="text-weight-medium q-pr-xs">Email: </span>
              {{ contact.email }}
            </div>
            <div class="row text-caption" v-if="filterSelection === 'phone'">
              <span class="text-weight-medium q-pr-xs">Phone: </span>
              {{ contact.phone }}
            </div>
            <div class="row text-caption" v-if="filterSelection === 'address'">
              <span class="text-weight-medium q-pr-xs">Address: </span>
              {{ contact.address }}
            </div>
          </div>
          <q-separator />
        </div>
      </div>
    </div>
  </q-card>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  iContactStructure,
  iContactList,
  iContactsListIndexable
} from '../../store/types';
import _ from 'lodash';
export type DataType = {
  filterString: string,
  filterSelection: string
};

export default Vue.extend({
  name: 'contactsList',
  components: {},
  props: {
    selectedContactId: {
      type: String,
      required: false,
      default: ''
    },
    isAddingContact: {
      type: Boolean,
      required: false,
      default: false
    },
    newContactId: {
      type: String,
      required: false,
      default: ''
    },
    isViewingContact: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  data(): DataType {
    return {
      filterString: '',
      filterSelection: 'Name'
    };
  },
  computed: {
    getFilterOptions(): Array<string> | [] {
      /* eslint-disable @typescript-eslint/no-unsafe-member-access */
      // unfortunately -> vue 2 and options API + eslint does not like the store being imported globally as it is declared Store<any>
      if (
        this.$store.getters.getFileContents &&
        this.$store.getters.getFileContents.length > 0
      ) {
        return Object.keys(this.$store.getters.getFileContents[0]);
      }
      return [];
    },
    contactDetailsSimplified(): iContactList | iContactsListIndexable | [] {
      if (
        this.$store.getters.getFileContents &&
        this.$store.getters.getFileContents.length > 0
      ) {
        const results: iContactList = this.$store.getters.getFileContents.map(
          (contact: iContactStructure) => {
            return {
              id: contact.id,
              name: contact.name,
              email: contact.email,
              phone: contact.phone,
              address: contact.address
            } as iContactStructure;
          }
        );
        if (this.filterString) {
          const key: string = this.filterSelection.toLowerCase();
          const results: iContactsListIndexable = this.$store.getters.getFileContents.filter(
            (contact: iContactsListIndexable) => {
              return contact[key]
                .toString()
                .toLowerCase()
                .includes(this.filterString);
            }
          );
          return this.sortByName(results);
        }
        return this.sortByName(results);
      }
      return [];
    }
  },
  methods: {
    sortByName(data: iContactList | iContactsListIndexable): iContactList {
      return _.sortBy(data, function(contact: iContactStructure) {
        return contact.name.toLowerCase();
      }) as iContactList;
    },
    displayContactInfo(contactId: string): void {
      this.$emit('displayContactInfo', contactId);
    },
    onItemClick(selection: string): void {
      this.filterSelection = selection;
    }
  }
});
</script>
