<template>
  <div>
    <div class="row q-pt-sm justify-center">
      <div class="text-primary text-weight-bolder" :class="customFontSize">
        Welcome to
      </div>
    </div>
    <div class="row q-pt-sm justify-center">
      <div class="text-primary text-weight-bolder" :class="customFontSize">
        Simple Secure Contact Manager
      </div>
    </div>
    <div class="row q-pt-sm justify-center">
      <transition name="component-fade" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'welcomeSection',
  components: {},
  data() {
    return {};
  },
  computed: {
    customFontSize(): string {
      if (this.$q.screen.xs) {
        return 'text-subtitle1';
      } else if (this.$q.screen.sm) {
        return 'text-h6';
      } else if (this.$q.screen.md) {
        return 'text-h5';
      } else {
        return 'text-h3';
      }
    }
  },
  methods: {}
});
</script>
