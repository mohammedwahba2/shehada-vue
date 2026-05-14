<template>
  <div class="flex min-h-[100dvh] flex-col overflow-x-hidden bg-white text-ink dark:bg-ink dark:text-white">
    <Header />

    <div class="flex min-h-0 flex-1">
      <slot />
    </div>
  </div>
</template>
