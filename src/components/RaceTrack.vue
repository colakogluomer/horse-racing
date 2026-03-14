<script setup lang="ts">
import { ref, watch, onUnmounted, computed } from 'vue'
import { useStore } from 'vuex'
import type { State, Horse, RaceResult } from '../store'
import RaceHorse from './RaceHorse.vue'

const store = useStore<State>()
const currentRound = computed(() => store.getters.currentRound)
const isRaceStarted = computed(() => store.state.isRaceStarted)
const isRacePaused = computed(() => store.state.isRacePaused)

interface HorsePosition {
  id: number
  name: string
  color: string
  percentage: number
  speed: number
  finished: boolean
  finishTime?: number
}

const horsePositions = ref<HorsePosition[]>([])
let animationId: number | null = null

const initRace = () => {
  if (!currentRound.value) return
  horsePositions.value = currentRound.value.participants.map((p: Horse) => ({
    id: p.id,
    name: p.name,
    color: p.color,
    percentage: 0,
    speed: 0.1 + (p.condition / 100) * 0.2 + Math.random() * 0.1,
    finished: false
  }))
}

const updateRace = () => {
  if (isRacePaused.value) {
    animationId = requestAnimationFrame(updateRace)
    return
  }

  let allFinished = true
  horsePositions.value.forEach(hp => {
    if (!hp.finished) {
      // Add random variation to speed
      const variation = (Math.random() - 0.5) * 0.05
      hp.percentage += Math.max(0, hp.speed + variation)
      
      if (hp.percentage >= 100) {
        hp.percentage = 100
        hp.finished = true
        hp.finishTime = Date.now()
      } else {
        allFinished = false
      }
    }
  })

  if (allFinished) {
    cancelAnimationFrame(animationId!)
    animationId = null
    finishRace()
  } else {
    animationId = requestAnimationFrame(updateRace)
  }
}

const finishRace = () => {
  const rankings: RaceResult[] = [...horsePositions.value]
    .sort((a, b) => (a.finishTime || 0) - (b.finishTime || 0))
    .map((hp, index) => ({
      horseId: hp.id,
      horseName: hp.name,
      position: index + 1
    }))
  
  store.dispatch('finishRace', rankings)
}

watch(currentRound, () => {
  if (!isRaceStarted.value) {
    initRace()
  }
}, { immediate: true })

watch(isRaceStarted, (newVal) => {
  if (newVal && !animationId) {
    animationId = requestAnimationFrame(updateRace)
  }
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<template>
  <div class="track-container">
    <div class="track-lanes">
      <div v-for="(hp, index) in horsePositions" :key="hp.id" class="lane">
        <RaceHorse 
          :name="hp.name" 
          :color="hp.color" 
          :position="hp.percentage" 
          :lane="index + 1"
        />
      </div>
    </div>
    <div class="finish-line">
      <div class="finish-text">FINISH</div>
    </div>
    <div class="lap-info" v-if="currentRound">
      {{ currentRound.id }}{{ currentRound.id === 1 ? 'st' : currentRound.id === 2 ? 'nd' : currentRound.id === 3 ? 'rd' : 'th' }} Lap {{ currentRound.distance }}m
    </div>
  </div>
</template>

<style scoped>
.track-container {
  position: relative;
  height: 100%;
  padding-left: 40px; /* Space for lane numbers inside the container */
  border-right: 5px solid #ff5a5f;
  background-color: #eee;
  display: flex;
  flex-direction: column;
}

.track-lanes {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Important for flex children */
}

.lane {
  flex: 1;
  min-height: 50px; /* Stable height for horses */
  position: relative;
  border-bottom: 2px dashed #999;
  display: flex;
  align-items: center;
}

.lane:last-child {
  border-bottom: none;
}

.finish-line {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 0; /* Finish line is now the container border */
}

.finish-text {
  position: absolute;
  bottom: -30px;
  right: 0;
  color: #ff5a5f;
  font-weight: bold;
  font-size: 1rem;
  pointer-events: none;
}

.lap-info {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  color: #ff5a5f;
  font-weight: bold;
  pointer-events: none;
  z-index: 10;
}
</style>
