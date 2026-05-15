<script setup lang="ts">
import { computed } from 'vue'
import type { OrbVisualMode } from '../types'

interface Props {
  mode: OrbVisualMode
}

const props = defineProps<Props>()

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

const orbLabel = computed(() => {
  const labels: Record<OrbVisualMode, string> = {
    listening: 'Listening for your voice',
    speaking: 'Speaking - please listen',
    engaged: 'Good job! Keep going',
    error: 'Error occurred',
    idle: 'Ready to start',
  }
  return labels[props.mode] || 'Audio visualizer'
})

const { markup: orbMarkup } = useOrbSvg(orbAsset)
</script>

<template>
  <div
    class="orb-wrap flex items-center justify-center"
    role="img"
    :aria-label="orbLabel"
  >
    <!-- Inline SVG (not img/object) — animations + gradients work on mobile Safari -->
    <div
      v-if="orbMarkup"
      :key="orbAsset"
      class="orb-svg"
      aria-hidden="true"
      v-html="orbMarkup"
    />
    <span class="sr-only">{{ orbLabel }}</span>
  </div>
</template>

<style scoped>
.orb-wrap {
  width: 13rem;
  height: 13rem;
  flex-shrink: 0;
  contain: layout style;
}

@media (min-width: 640px) {
  .orb-wrap {
    width: 16rem;
    height: 16rem;
  }
}

.orb-svg {
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.orb-svg :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
