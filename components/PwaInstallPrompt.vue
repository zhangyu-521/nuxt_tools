<template>
  <Teleport to="body">
    <!-- Debug: Manual Install Button (always visible) -->
    <button
      v-if="!showPrompt && !isInstalled"
      @click="showManualInstall = true"
      class="fixed bottom-4 right-4 z-40 p-3 rounded-full bg-primary-500 text-white shadow-lg hover:bg-primary-600 transition-all"
      title="安装应用"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </button>

    <!-- Manual Install Modal -->
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showManualInstall"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="showManualInstall = false"
      >
        <div class="card p-6 max-w-md w-full shadow-xl">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            安装应用到主屏幕
          </h3>

          <div class="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <!-- iOS Safari -->
            <div class="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
              <p class="font-medium text-gray-900 dark:text-gray-100 mb-2">iPhone / iPad (Safari)</p>
              <ol class="list-decimal list-inside space-y-1">
                <li>点击底部工具栏的 <strong>分享</strong> 按钮</li>
                <li>向下滚动，点击 <strong>添加到主屏幕</strong></li>
                <li>点击 <strong>添加</strong></li>
              </ol>
            </div>

            <!-- Android Chrome -->
            <div class="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
              <p class="font-medium text-gray-900 dark:text-gray-100 mb-2">Android (Chrome)</p>
              <ol class="list-decimal list-inside space-y-1">
                <li>点击右上角的 <strong>菜单</strong> (三个点)</li>
                <li>点击 <strong>添加到主屏幕</strong> 或 <strong>安装应用</strong></li>
                <li>点击 <strong>安装</strong></li>
              </ol>
            </div>

            <!-- Desktop Chrome/Edge -->
            <div class="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
              <p class="font-medium text-gray-900 dark:text-gray-100 mb-2">电脑端 (Chrome/Edge)</p>
              <ol class="list-decimal list-inside space-y-1">
                <li>点击地址栏右侧的 <strong>安装图标</strong> <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></li>
                <li>或点击菜单 → <strong>安装我的日记</strong></li>
              </ol>
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <button
              @click="showManualInstall = false"
              class="flex-1 px-4 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 font-medium transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Auto Install Prompt -->
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showPrompt"
        class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50"
      >
        <div class="card p-4 shadow-xl border border-primary-200 dark:border-primary-800">
          <div class="flex items-start gap-3">
            <!-- App Icon -->
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/25">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 dark:text-gray-100">
                安装 我的日记
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                添加到主屏幕，离线也能使用
              </p>
            </div>

            <!-- Close Button -->
            <button
              @click="dismissPrompt"
              class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-4">
            <button
              @click="dismissPrompt"
              class="flex-1 px-4 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 font-medium transition-colors"
            >
              暂不
            </button>
            <button
              @click="installPwa"
              class="flex-1 px-4 py-2.5 btn-primary"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              安装应用
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const showPrompt = ref(false)
const showManualInstall = ref(false)
const deferredPrompt = ref<any>(null)
const isInstalled = ref(false)
const manifestStatus = ref('checking')
const swStatus = ref('checking')

// Check if already installed or dismissed
const INSTALL_DISMISSED_KEY = 'pwa-install-dismissed'
const INSTALL_DATE_KEY = 'pwa-install-date'

onMounted(async () => {
  // Check if already installed as PWA
  if (window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true) {
    isInstalled.value = true
    return
  }

  // Check if prompt was recently dismissed (within 7 days)
  const dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY)
  if (dismissed) {
    const dismissedDate = new Date(dismissed)
    const now = new Date()
    const daysSince = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSince < 7) {
      return
    }
  }

  // Check manifest
  try {
    const manifestLink = document.querySelector('link[rel="manifest"]')
    if (manifestLink) {
      const response = await fetch(manifestLink.getAttribute('href') || '/manifest.webmanifest')
      if (response.ok) {
        manifestStatus.value = 'ok'
      } else {
        manifestStatus.value = `error: ${response.status}`
      }
    } else {
      manifestStatus.value = 'missing link'
    }
  } catch (e: any) {
    manifestStatus.value = `error: ${e.message}`
  }

  // Check Service Worker
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      if (registrations.length > 0 && registrations[0].active) {
        swStatus.value = 'active'
      } else {
        swStatus.value = 'no registration'
      }
    } catch (e: any) {
      swStatus.value = `error: ${e.message}`
    }
  } else {
    swStatus.value = 'not supported'
  }

  // Debug logging
  console.log('[PWA] Manifest status:', manifestStatus.value)
  console.log('[PWA] Service Worker status:', swStatus.value)
  console.log('[PWA] Display mode:', window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser')

  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault()
    // Store the event for later use
    deferredPrompt.value = e
    // Show our custom prompt
    showPrompt.value = true
  })

  // Listen for appinstalled event
  window.addEventListener('appinstalled', () => {
    showPrompt.value = false
    deferredPrompt.value = null
    localStorage.setItem(INSTALL_DATE_KEY, new Date().toISOString())
  })
})

function dismissPrompt() {
  showPrompt.value = false
  localStorage.setItem(INSTALL_DISMISSED_KEY, new Date().toISOString())
}

async function installPwa() {
  if (!deferredPrompt.value) {
    // For iOS Safari, show manual instructions
    alert('请使用 Safari 浏览器的"分享到主屏幕"功能安装此应用')
    return
  }

  // Show the install prompt
  deferredPrompt.value.prompt()

  // Wait for the user to respond
  const { outcome } = await deferredPrompt.value.userChoice

  if (outcome === 'accepted') {
    showPrompt.value = false
    localStorage.setItem(INSTALL_DATE_KEY, new Date().toISOString())
  }

  // Clear the deferredPrompt
  deferredPrompt.value = null
}
</script>
