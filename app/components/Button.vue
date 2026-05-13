<script setup lang="ts">
import { BookText } from 'lucide-vue-next'
import type { ButtonVariant } from '~/types'

const props = withDefaults(defineProps<{
  /** The visual variant of the button */
  variant: ButtonVariant
  /** Whether the button is disabled */
  disabled?: boolean
  /** The type attribute for the button element */
  type?: 'button' | 'submit' | 'reset'
}>(), {
  disabled: false,
  type: 'button'
})

const emit = defineEmits<{
  click: []
}>()

/** CSS classes for each button variant */
const variantClasses: Record<ButtonVariant, string> = {
  start:
    'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500/40 dark:bg-blue-500 dark:hover:bg-blue-400',
  stop:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/40 dark:bg-red-500 dark:hover:bg-red-400',
  certificate:
    'min-w-[220px] gap-2 bg-zinc-900 text-white hover:bg-zinc-800 focus-visible:ring-zinc-500/40 dark:bg-zinc-950 dark:hover:bg-zinc-900',
  learnMore:
    'min-w-[220px] border-2 border-zinc-900 bg-white text-zinc-900 hover:bg-zinc-50 focus-visible:ring-zinc-400/40 dark:border-zinc-100 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-zinc-900/40',
}

/** Base classes applied to all button variants */
const baseClasses = [
  'inline-flex min-h-[48px] items-center justify-center rounded-full px-7 py-3',
  'text-sm font-semibold shadow-sm transition',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'dark:focus-visible:ring-offset-zinc-950',
]
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    :class="[
      ...baseClasses,
      variantClasses[props.variant],
    ]"
    @click="emit('click')"
  >
    <BookText v-if="props.variant === 'certificate'" :size="20" class="shrink-0" />
    <slot />
  </button>
</template>
