export function useTheme() {
  const colorMode = useColorMode()

  const isDark = computed(() => colorMode.value === 'dark')

  const toggleTheme = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  const setTheme = (theme: 'light' | 'dark') => {
    colorMode.preference = theme
  }

  return {
    isDark,
    toggleTheme,
    setTheme,
    currentTheme: colorMode,
  }
}
