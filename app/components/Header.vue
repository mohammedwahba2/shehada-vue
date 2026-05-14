<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { navigationLinks } from '~/constants/navigation'

const colorMode = useColorMode()

/** Whether the current theme is dark mode */
const isDark = computed(() => colorMode.value === 'dark')

/** Toggle between light and dark themes */
const toggleTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <header>
    <nav
      class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
      role="navigation"
      aria-label="Main navigation"
    >
      <NuxtLink
        to="/"
        class="text-lg font-bold text-zinc-900 dark:text-white sm:text-xl focus:outline-none focus:ring-2 focus:ring-ink/40 dark:focus:ring-white/40 rounded-full px-2 py-1"
      >
        SHAHADA
      </NuxtLink>
      
      <ul
        class="hidden items-center gap-12 text-sm font-semibold uppercase tracking-wide text-ink dark:text-white md:flex"
      >
        <li v-for="link in navigationLinks" :key="link.href">
          <NuxtLink
            :to="link.href"
            class="transition hover:text-zinc-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-ink/40 dark:focus:ring-white/40 rounded-full px-2 py-1"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>

      <div class="flex items-center gap-3">
        <button
          type="button"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          class="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border border-ink text-ink transition hover:bg-ink/10 active:bg-ink/15 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-ink/40 dark:focus:ring-white/40"
          @click="toggleTheme"
        >
          <Sun v-if="isDark" :size="18" :stroke-width="2" class="text-current" />
          <Moon v-else :size="18" :stroke-width="2" class="text-current" />
        </button>

        <MobileMenu />
      </div>
    </nav>
  </header>
</template>
