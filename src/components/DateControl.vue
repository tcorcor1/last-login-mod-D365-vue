<template>
  <div class="src-item">
    <div class="date-item">
      <label class="item-label">Date (after):</label>
      <input
        v-model="dateOnAfter"
        @change="dateUpdatedHandler"
        class="input"
        type="date"
      />
    </div>
    <div class="date-item">
      <label class="item-label">Date (before):</label>
      <input
        v-model="dateOnBefore"
        @change="dateUpdatedHandler"
        class="input"
        type="date"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DateControl',

  data() {
    return {
      dateOnAfter: '',
      dateOnBefore: '',
    };
  },

  methods: {
    dateUpdatedHandler() {
      this.$emit('date-change', {
        dateOnAfter: this.dateOnAfter,
        dateOnBefore: this.dateOnBefore,
      });
    },
  },
};
</script>

<style scoped>
.date-item {
  display: flex;
  align-items: center;
  padding: 12px;
}

@media screen and (max-width: 600px) {
  .date-item {
    width: 100%;
  }
}
</style>
