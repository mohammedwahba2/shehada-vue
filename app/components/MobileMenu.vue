<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next'
import { navigationLinks } from '~/constants/navigation'

const isOpen = ref(false)
const menuButtonRef = ref<HTMLButtonElement | null>(null)

/** Watch for menu state changes to manage body scroll */
watch(isOpen, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
  
  // Focus management
  if (open) {
    // Focus first menu item when opened
    setTimeout(() => {
      const firstLink = document.querySelector('[role="dialog"] a')
      if (firstLink) (firstLink as HTMLElement).focus()
    }, 100)
  } else {
    // Return focus to menu button when closed
    menuButtonRef.value?.focus()
  }
})

/** Close menu on escape key */
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  if (import.meta.client) {
    document.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div>
    <button
      ref="menuButtonRef"
      aria-label="Open menu"
      :aria-expanded="isOpen"
      aria-controls="mobile-menu"
      class="icon-btn max-md:flex md:hidden"
      @click="isOpen = true"
    >
      <AppIcon :size="18"><Menu :size="18" :stroke-width="2" /></AppIcon>
    </button>

    <!-- Backdrop -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 bg-black/50 transition-opacity"
      @click="isOpen = false"
      aria-hidden="true"
    />

    <!-- Menu panel -->
    <aside
      id="mobile-menu"
      role="dialog"
      aria-label="Mobile menu"
      :aria-hidden="!isOpen"
      class="fixed right-0 top-0 z-50 h-full w-72 bg-white p-6 shadow-2xl transition-transform duration-300 dark:bg-zinc-900 focus:outline-none"
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
      tabindex="-1"
    >
      <div class="mb-10 flex items-center justify-between">
        <span class="text-lg font-bold text-zinc-900 dark:text-white">
          Menu
        </span>

        <button
          aria-label="Close menu"
          class="icon-btn"
          @click="isOpen = false"
        >
          <AppIcon :size="18"><X :size="18" :stroke-width="2" /></AppIcon>
        </button>
      </div>

      <nav role="navigation" aria-label="Mobile navigation">
        <ul class="flex flex-col gap-6 text-lg font-semibold text-zinc-800 dark:text-zinc-100">
          <li v-for="link in navigationLinks" :key="link.href">
            <NuxtLink 
              :to="link.href" 
              class="block py-2 focus:outline-none focus:ring-2 focus:ring-ink/40 dark:focus:ring-white/40 rounded-lg px-2 -mx-2"
              @click="isOpen = false"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>