<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { State } from '../store'

const store = useStore<State>()
const currentRoundIndex = computed(() => store.state.currentRoundIndex)
const rounds = computed(() => store.state.rounds)
const programRounds = computed(() => rounds.value.slice(currentRoundIndex.value))
const results = computed(() => store.state.results)
</script>

<template>
  <div class="program-results-container">
    <div class="program-section">
      <div class="header blue">Program</div>
      <div class="content">
        <div v-if="programRounds.length > 0">
          <div v-for="round in programRounds" :key="'prog-' + round.id" class="round-group">
            <div class="round-header red">
              {{ round.id }}{{ round.id === 1 ? 'ST' : round.id === 2 ? 'ND' : round.id === 3 ? 'RD' : 'TH' }} Lap - {{ round.distance }}m
            </div>
            <table>
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(participant, index) in round.participants" :key="participant.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ participant.name }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="finished-message">
          ALL RACES COMPLETED!
        </div>
      </div>
    </div>

    <div class="results-section">
      <div class="header green-bg">Results</div>
      <div class="content">
        <div v-for="result in results" :key="'res-' + result.roundId" class="round-group">
          <div class="round-header red">
            {{ result.roundId }}{{ result.roundId === 1 ? 'ST' : result.roundId === 2 ? 'ND' : result.roundId === 3 ? 'RD' : 'TH' }} Lap - {{ result.distance }}m
          </div>
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rank in result.rankings" :key="rank.horseId">
                <td>{{ rank.position }}</td>
                <td>{{ rank.horseName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.program-results-container {
  display: flex;
  height: 100%;
  gap: 10px;
}

.program-section, .results-section {
  flex: 1;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  padding: 10px;
  font-weight: bold;
  text-align: center;
  border-bottom: 2px solid #000;
  font-size: 1.2rem;
  color: #000;
}

.blue {
  background-color: #4a90e2;
}

.green-bg {
  background-color: #7ed321;
}

.content {
  flex: 1;
  overflow-y: auto;
  background-color: white;
}

.round-group {
  margin-bottom: 0;
}

.round-header {
  padding: 5px;
  font-weight: bold;
  text-align: center;
  color: #000;
  font-size: 0.9rem;
  border-bottom: 1px solid #000;
}

.red {
  background-color: #ff5a5f;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 4px 8px;
  border: 1px solid #ccc;
  font-size: 0.85rem;
  color: #000;
}

th {
  background-color: #f9f9f9;
  font-weight: bold;
  border-bottom: 2px solid #000;
}

td {
  text-align: center;
}

td:nth-child(2) {
  text-align: left;
}

.finished-message {
  padding: 40px 20px;
  text-align: center;
  font-weight: 800;
  font-size: 1.5rem;
  color: #ff5a5f;
  text-transform: uppercase;
}
</style>
