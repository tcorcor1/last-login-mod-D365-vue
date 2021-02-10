<template>
  <div class="src-item" style="flex-wrap: nowrap;">
    <input
      class="input"
      type="text"
      placeholder="Search user by email address"
      style="min-width:300px;"
      v-model="userEmail"
      v-bind:class="{ 'is-danger': !isValidEmail }"
      v-on:keyup="validateEmail(userEmail)"
      v-on:keyup.enter="onSearchHandler"
    />
    <font-awesome-icon
      class="input-icon"
      icon="exclamation-triangle"
      v-if="!isValidEmail"
    />
  </div>
</template>

<script>
export default {
  name: 'EmailSearchControl',

  data() {
    return {
      userEmail: '',
      isValidEmail: true,
    };
  },

  methods: {
    onSearchHandler(event) {
      this.$emit('on-search', event.target.value);
    },

    validateEmail(email) {
      const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.isValidEmail = !email
        ? true
        : regEx.test(String(email).toLowerCase());
    },
  },
};
</script>

<style scoped></style>
