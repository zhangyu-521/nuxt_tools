import { defineStore } from 'pinia'
import type { AppSettings } from '~/types'

const STORAGE_KEY = 'diary-app-settings'

const defaultSettings: AppSettings = {
  theme: 'light',
  language: 'zh-CN',
}

export const useSettingsStore = defineStore('settings', () => {
  // State
  const settings = ref<AppSettings>({ ...defaultSettings })

  // Getters
  const isDark = computed(() => settings.value.theme === 'dark')

  // Actions
  function loadSettings() {
    if (process.server) return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        settings.value = { ...defaultSettings, ...JSON.parse(stored) }
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
  }

  function saveSettings() {
    if (process.server) return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
    } catch (e) {
      console.error('Failed to save settings:', e)
    }
  }

  function setTheme(theme: 'light' | 'dark') {
    settings.value.theme = theme
    saveSettings()
    applyTheme()
  }

  function toggleTheme() {
    const newTheme = settings.value.theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  function applyTheme() {
    if (process.server) return

    const html = document.documentElement
    if (settings.value.theme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  // Initialize on client
  if (process.client) {
    loadSettings()
    applyTheme()
  }

  return {
    settings,
    isDark,
    loadSettings,
    saveSettings,
    setTheme,
    toggleTheme,
    applyTheme,
  }
})
