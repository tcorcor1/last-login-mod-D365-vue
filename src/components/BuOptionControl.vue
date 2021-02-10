<template>
  <div class="src-item">
    <label class="item-label">Business Unit:</label>
    <div class="select">
      <select
        id="business-units"
        v-model="selectedBuId"
        @change="buUpdatedHandler"
      >
        <option value="">Any</option>
        <option v-for="(bu, index) in buDataArr" :key="index" :value="bu.Id"
          >{{ bu.Name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BuOptionControl',

  data() {
    return {
      buDataArr: [],
      selectedBuId: '',
    };
  },

  methods: {
    buUpdatedHandler() {
      this.$emit('bu-changed', this.selectedBuId);
    },

    async getBuData() {
      await fetch(
        `${window.location.origin}/api/data/v${this.$apiVersion}/businessunits?$select=name,businessunitid`,
      )
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            alert(
              `Server Response: ${response.status}\nError retrieving BU data. Please refresh/try again.`,
            );
          }
        })
        .then(data => (this.buDataArr = this.transformBuData(data.value)))
        .catch(error => {
          throw new Error(
            `Last-Login-Mod: Could not successfully retrieve BU Data.\n${error}`,
          );
        });
    },

    transformBuData(loadArr) {
      return loadArr.map(obj => {
        return {
          Id: obj.businessunitid,
          Name: obj.name.replace(/[^a-zA-Z0-9-|_\s]/g, '').trim(),
        };
      });
    },
  },

  mounted() {
    this.getBuData();
  },
};
</script>

<style scoped />
