// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
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
    '@nuxtjs/seo'
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
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://shahada.com',
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
    download: true,
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

  // SEO configuration
  site: {
    name: 'Shahada App',
    description: 'Learn and recite the Shahada with real-time Arabic transcription and voice recognition.',
    defaultLocale: 'en',
  },

  // Robots configuration
  robots: {
    disallow: [],
  },

  // Sitemap configuration
  sitemap: {
    urls: ['/'],
  },
})
