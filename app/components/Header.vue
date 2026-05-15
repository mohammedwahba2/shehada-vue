<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { navigationLinks } from '~/constants/navigation'

const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

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
        class="rounded-full px-2 py-1 text-lg font-bold text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 dark:text-white dark:focus-visible:ring-white/40 sm:text-xl"
      >
        SHAHADA
      </NuxtLink>

      <ul
        class="hidden items-center gap-12 text-sm font-semibold uppercase tracking-wide text-ink dark:text-white md:flex"
      >
        <li v-for="link in navigationLinks" :key="link.href">
          <NuxtLink
            :to="link.href"
            class="rounded-full px-2 py-1 transition hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 dark:hover:text-white dark:focus-visible:ring-white/40"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>

      <div class="flex items-center gap-3">
        <button
          type="button"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          class="icon-btn"
          @click="toggleTheme"
        >
          <AppIcon :size="18">
            <Sun v-if="isDark" :size="18" :stroke-width="2" />
            <Moon v-else :size="18" :stroke-width="2" />
          </AppIcon>
        </button>

        <MobileMenu />
      </div>
    </nav>
  </header>
</template>
