<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import type { State } from '../store'
import HorseList from '../components/HorseList.vue'
import RaceTrack from '../components/RaceTrack.vue'
import RaceProgramResults from '../components/RaceProgramResults.vue'

const store = useStore<State>()

const isRaceStarted = computed(() => store.state.isRaceStarted)
const isRacePaused = computed(() => store.state.isRacePaused)
const rounds = computed(() => store.state.rounds)

const generateProgram = () => {
  store.dispatch('generateInitialData')
}

const toggleRace = () => {
  if (!isRaceStarted.value) {
    store.dispatch('startRace')
  } else if (isRacePaused.value) {
    store.dispatch('resumeRace')
  } else {
    store.dispatch('pauseRace')
  }
}

onMounted(() => {
  if (store.state.horses.length === 0) {
    store.dispatch('generateInitialData')
  }
})
</script>

<template>
  <div class="game-layout">
    <header class="game-header">
      <h1 class="title">Horse Racing</h1>
      <div class="controls">
        <button @click="generateProgram">GENERATE PROGRAM</button>
        <button @click="toggleRace" :disabled="rounds.length === 0 || store.state.currentRoundIndex >= rounds.length">
          {{ !isRaceStarted ? 'START' : isRacePaused ? 'RESUME' : 'PAUSE' }}
        </button>
      </div>
    </header>

    <main class="game-body">
      <section class="left-panel">
        <HorseList />
      </section>
      <section class="center-panel">
        <RaceTrack />
      </section>
      <section class="right-panel">
        <RaceProgramResults />
      </section>
    </main>
  </div>
</template>

<style scoped>
.game-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
  overflow: hidden;
}

.game-header {
  background-color: #ff5a5f;
  padding: 6px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  z-index: 100;
}

.title {
  color: #000;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
}

.controls {
  display: flex;
  gap: 20px;
}

button {
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid #000;
  background-color: #f0f0f0;
  color: #000;
  transition: all 0.2s;
  box-shadow: 2px 2px 0px #000;
}

button:hover {
  background-color: #fff;
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0px #000;
}

button:active {
  transform: translate(1px, 1px);
  box-shadow: 0px 0px 0px #000;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.game-body {
  flex: 1;
  display: grid;
  grid-template-columns: 260px 1fr 480px;
  gap: 20px;
  padding: 20px;
  overflow: hidden;
}

.left-panel, .right-panel {
  overflow: hidden;
}

.center-panel {
  display: flex;
  flex-direction: column;
  padding-bottom: 60px; /* Space for lap info */
}

@media (max-width: 1024px) {
  .game-layout {
    height: auto;
    overflow-y: auto;
  }

  .game-body {
    grid-template-columns: 1fr;
    height: auto;
    overflow-y: visible;
  }

  .left-panel, .center-panel, .right-panel {
    overflow: visible;
    height: auto;
  }

  .center-panel {
    order: -1; /* Keep race track at the top */
    min-height: 400px;
  }
}
</style>
