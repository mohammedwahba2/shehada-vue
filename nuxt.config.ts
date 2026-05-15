// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  
  // App configuration
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
        dir: 'ltr',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5' },
        { name: 'theme-color', content: '#1B1C1E' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/favicon.ico' },
        { rel: 'preload', href: '/orbs/listen.svg', as: 'image', type: 'image/svg+xml' },
        { rel: 'preload', href: '/orbs/speak.svg', as: 'image', type: 'image/svg+xml' },
        { rel: 'preload', href: '/orbs/engage.svg', as: 'image', type: 'image/svg+xml' },
        { rel: 'preload', href: '/orbs/error.svg', as: 'image', type: 'image/svg+xml' },
      ],
    },
  },

  // CSS
  css: ['~/assets/main.css'],

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts',
  ],

  // Color mode configuration
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  // Runtime configuration
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://shehada-vue.vercel.app',
      siteName: 'Shahada App',
      siteDescription:
        'Learn and recite the Shahada with real-time Arabic transcription and voice recognition for accurate pronunciation practice.',
    },
  },

  // Google Fonts
  googleFonts: {
    families: {
      Tajawal: [400, 500, 700],
    },
    display: 'swap',
    prefetch: true,
    preconnect: true,
    download: false,
    inject: true,
  },

  // Vite configuration
  vite: {
    optimizeDeps: {
      include: [
        'lucide-vue-next',
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ],
    },
    build: {
      target: 'esnext',
    },
  },

  // Build optimization
  nitro: {
    compressPublicAssets: {
      brotli: true,
      gzip: true,
    },
  },

})
