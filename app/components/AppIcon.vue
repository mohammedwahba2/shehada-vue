<script setup lang="ts">
/**
 * Wraps Lucide icons with stable sizing on mobile (prevents flex collapse / layout shift).
 */
withDefaults(
  defineProps<{
    size?: number
    label?: string
  }>(),
  { size: 18 }
)
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center leading-none [&>svg]:block [&>svg]:shrink-0"
    :style="{ width: `${size}px`, height: `${size}px` }"
    :aria-hidden="label ? undefined : true"
    :aria-label="label"
  >
    <slot />
  </span>
</template>
