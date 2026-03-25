<template>
  <div class="flex items-center justify-center sm:justify-start gap-2 sm:gap-4">
    <button
      v-for="mood in moods"
      :key="mood.value"
      @click="selectMood(mood.value)"
      class="mood-btn flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-2xl transition-all duration-300 group"
      :class="modelValue === mood.value
        ? 'active bg-white dark:bg-slate-700 shadow-lg scale-105'
        : 'hover:bg-gray-50 dark:hover:bg-slate-700/50 opacity-60 hover:opacity-100'"
    >
      <div
        class="text-3xl sm:text-4xl transition-transform duration-300"
        :class="modelValue === mood.value ? 'animate-bounce-slight' : 'group-hover:scale-110'"
      >
        {{ mood.emoji }}
      </div>
      <span
        class="text-[10px] sm:text-xs font-medium transition-colors"
        :class="modelValue === mood.value
          ? 'text-gray-900 dark:text-gray-100'
          : 'text-gray-400 dark:text-gray-500'"
      >
        {{ mood.label }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: number
}

interface Emits {
  (e: 'update:modelValue', value: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const moods = [
  { value: 1, emoji: '😢', label: '糟糕' },
  { value: 2, emoji: '😕', label: '不好' },
  { value: 3, emoji: '😐', label: '一般' },
  { value: 4, emoji: '🙂', label: '不错' },
  { value: 5, emoji: '😄', label: '超棒' },
]

function selectMood(value: number) {
  emit('update:modelValue', value)
}
</script>

<style scoped>
@keyframes bounce-slight {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce-slight {
  animation: bounce-slight 0.5s ease;
}
</style>
