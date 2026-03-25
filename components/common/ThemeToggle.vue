<template>
  <button
    @click="settingsStore.toggleTheme"
    class="relative w-10 h-10 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-sm border"
    :class="settingsStore.isDark
      ? 'bg-slate-700 border-slate-600 text-amber-400 shadow-slate-900/20'
      : 'bg-white border-gray-200 text-amber-500 shadow-gray-200/50'"
    :title="settingsStore.isDark ? '切换到日间模式' : '切换到夜间模式'"
  >
    <!-- Sun icon -->
    <svg
      v-if="settingsStore.isDark"
      class="w-5 h-5 absolute inset-0 m-auto transition-all duration-300 animate-spin-slow"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
    <!-- Moon icon -->
    <svg
      v-else
      class="w-5 h-5 absolute inset-0 m-auto transition-all duration-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()
</script>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}
</style>
