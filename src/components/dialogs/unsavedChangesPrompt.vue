<template>
  <q-card flat>
    <div class="text-primary">
      <div class="text-weight-bolder q-pa-md text-center text-subtitle1">
        You currently have unsaved changes are you sure you would like to
        discard them?
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
        />
      </div>
    </div>
  </q-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'unsavedChangesPrompt',
  props: {
    viewUnsavedChangesPrompt: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    confirm(): void {
      this.$emit('confirmDiscard', true);
    },
    closeDialog(): void {
      this.$emit('update:viewUnsavedChangesPrompt', false);
    }
  }
});
</script>
