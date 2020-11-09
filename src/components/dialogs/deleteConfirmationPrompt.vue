<template>
  <q-card flat>
    <div class="text-primary">
      <div class="text-weight-bolder q-pa-md text-center text-subtitle1">
        Are you sure you would like to delete the Contact?
      </div>

      <div class="row justify-center q-pb-md">
        <q-btn
          label="No"
          color="negative"
          class="q-mr-lg text-capitalize"
          @click="closeDialog"
        />
        <q-btn
          label="Yes"
          @click="confirm"
          color="positive"
          class="text-capitalize"
          :loading="confirmBtnLoading"
        />
      </div>
    </div>
  </q-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'deleteConfirmationPrompt',
  props: {
    viewDeleteConfirmationPrompt: {
      type: Boolean,
      required: false,
      default: false
    },
    confirmBtnLoading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    confirm(): void {
      this.$emit('update:confirmBtnLoading', true);
      this.$emit('confirmDelete', true);
    },
    closeDialog(): void {
      this.$emit('update:viewDeleteConfirmationPrompt', false);
    }
  }
});
</script>
