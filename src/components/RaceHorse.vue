<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  color: string
  position: number
  lane: number
}>()

const horseStyle = computed(() => ({
  // Map 100% to (track width - horse width + 3px) so nose is 3px past the line
  left: `calc(${props.position}% - (${props.position} / 100 * 47px))`
}))
</script>

<template>
  <div class="lane-number">{{ lane }}</div>
  <div class="horse-wrapper" :style="horseStyle">
    <div class="horse-body">
      <!-- Using IMG tag for Horse SVG as per user request -->
      <img src="@/assets/horse.svg" :alt="name" class="horse-img" />
      <div class="horse-name">{{ name }}</div>
    </div>
  </div>
</template>

<style scoped>
.lane-number {
  position: absolute;
  left: -40px;
  width: 40px;
  height: 48px;
  background-color: #437336;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  z-index: 2;
  border-right: 1px solid #333;
}

.horse-wrapper {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  transition: none;
  z-index: 5;
}

.horse-body {
  position: relative;
  width: 100%;
  height: 100%;
}

.horse-name {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.65rem;
  white-space: nowrap;
  font-weight: bold;
  color: #333;
  background: rgba(255, 255, 255, 0.9);
  padding: 0 4px;
  border-radius: 2px;
  border: 1px solid #ccc;
  z-index: 6;
}

.horse-img {
  width: 100%;
  height: 100%;
}
</style>
