<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { State } from '../store'

const store = useStore<State>()
const horses = computed(() => store.state.horses)
</script>

<template>
  <div class="horse-list-container">
    <div class="header yellow">Horse List (1- 20)</div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Condition</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="horse in horses" :key="horse.id">
            <td>{{ horse.name }}</td>
            <td class="center">{{ horse.condition }}</td>
            <td class="center">{{ horse.color }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.horse-list-container {
  border: 1px solid #ccc;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.header {
  padding: 10px;
  font-weight: bold;
  text-align: left;
  border-bottom: 2px solid #ccc;
  color: #000;
}

.yellow {
  background-color: #fce444;
}

.table-wrapper {
  flex: 1;
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background-color: #f0f0f0;
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ccc;
  position: sticky;
  top: 0;
  color: #000;
  font-weight: bold;
}

td {
  padding: 8px;
  border-bottom: 1px solid #eee;
  color: #333;
}

.center {
  text-align: center;
}

.color-box {
  width: 20px;
  height: 20px;
  border: 1px solid #000;
}
</style>
