<script setup lang="ts">
import { computed } from 'vue'
import type { OrbVisualMode } from '../types'

interface Props {
  /** The visual mode/state of the orb */
  mode: OrbVisualMode
}

const props = defineProps<Props>()

/** Map of orb modes to their corresponding SVG assets */
const orbAsset = computed(() => {
  switch (props.mode) {
    case 'listening':
      return '/orbs/listen.svg'
    case 'engaged':
      return '/orbs/engage.svg'
    case 'error':
      return '/orbs/error.svg'
    default:
      return '/orbs/speak.svg'
  }
})

/** Accessibility label for the orb based on current mode */
const orbLabel = computed(() => {
  const labels: Record<OrbVisualMode, string> = {
    listening: 'Listening for your voice',
    speaking: 'Speaking - please listen',
    engaged: 'Good job! Keep going',
    error: 'Error occurred',
    idle: 'Ready to start'
  }
  return labels[props.mode] || 'Audio visualizer'
})
</script>


<template>
  <div 
    class="flex items-center justify-center"
    role="img"
    :aria-label="orbLabel"
  >
    <img
      :src="orbAsset"
      :alt="orbLabel"
      width="200"
      height="200"
      draggable="false"
      class="h-52 w-52 max-w-full transition-opacity duration-300 sm:h-64 sm:w-64"
    />
  </div>
</template>
