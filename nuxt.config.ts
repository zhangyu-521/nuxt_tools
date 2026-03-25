// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
  ],
  css: [
    '~/assets/css/main.css',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  ssr: false,
  app: {
    baseURL: '/nuxt_tools/',
    head: {
      title: '我的日记',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '个人日记应用 - 记录生活点滴' },
        { name: 'theme-color', content: '#0ea5e9' },
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/nuxt_tools/apple-touch-icon.png' },
      ],
    },
  },
  nitro: {
    preset: 'github_pages',
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: '我的日记',
      short_name: '日记',
      description: '个人日记应用 - 记录生活点滴',
      theme_color: '#0ea5e9',
      background_color: '#f8fafc',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/nuxt_tools/',
      start_url: '/nuxt_tools/',
      icons: [
        {
          src: '/nuxt_tools/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/nuxt_tools/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/nuxt_tools/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/nuxt_tools/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },
})
