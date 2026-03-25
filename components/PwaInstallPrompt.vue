<template>
  <Teleport to="body">
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
const deferredPrompt = ref<any>(null)

// Check if already installed or dismissed
const INSTALL_DISMISSED_KEY = 'pwa-install-dismissed'
const INSTALL_DATE_KEY = 'pwa-install-date'

onMounted(() => {
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
