<template>
  <div class="space-y-6">
    <!-- Month Navigation -->
    <div class="flex items-center justify-between">
      <button
        @click="prevMonth"
        class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
      >
        <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
        {{ displayMonth }}
      </div>

      <button
        @click="nextMonth"
        class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
      >
        <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Weekday Headers -->
    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="day in weekdays"
        :key="day"
        class="text-center text-xs font-medium text-gray-400 py-2"
      >
        {{ day }}
      </div>
    </div>

    <!-- Calendar Days -->
    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="day in calendarDays"
        :key="day.date"
        @click="selectDay(day.date)"
        class="relative aspect-square p-1 sm:p-2 rounded-xl text-sm transition-all duration-200 flex flex-col items-center justify-center"
        :class="[
          day.isCurrentMonth
            ? 'text-gray-900 dark:text-gray-100'
            : 'text-gray-300 dark:text-gray-600',
          isToday(day.date)
            ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
            : 'hover:bg-gray-100 dark:hover:bg-slate-700/50',
        ]"
      >
        <span class="font-medium">{{ day.dayOfMonth }}</span>

        <!-- Indicators -->
        <div class="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
          <span
            v-if="hasDiary(day.date)"
            class="w-1.5 h-1.5 rounded-full bg-emerald-400"
            :class="isToday(day.date) ? 'bg-white/80' : ''"
          />
          <span
            v-if="hasTodo(day.date)"
            class="w-1.5 h-1.5 rounded-full bg-amber-400"
            :class="isToday(day.date) ? 'bg-white/80' : ''"
          />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCalendarDays, getToday, getCurrentMonth } from '~/utils/date'

interface Props {
  diaries: { date: string }[]
  todos: { date: string }[]
}

interface Emits {
  (e: 'select', date: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const currentMonth = ref(getCurrentMonth())
const weekdays = ['日', '一', '二', '三', '四', '五', '六']

const displayMonth = computed(() => {
  const [year, month] = currentMonth.value.split('-').map(Number)
  return `${year}年${month}月`
})

const calendarDays = computed(() => {
  return getCalendarDays(currentMonth.value)
})

const diaryDates = computed(() => new Set(props.diaries.map(d => d.date)))
const todoDates = computed(() => new Set(props.todos.map(t => t.date)))

function prevMonth() {
  const [year, month] = currentMonth.value.split('-').map(Number)
  const newMonth = month === 1 ? 12 : month - 1
  const newYear = month === 1 ? year - 1 : year
  currentMonth.value = `${newYear}-${String(newMonth).padStart(2, '0')}`
}

function nextMonth() {
  const [year, month] = currentMonth.value.split('-').map(Number)
  const newMonth = month === 12 ? 1 : month + 1
  const newYear = month === 12 ? year + 1 : year
  currentMonth.value = `${newYear}-${String(newMonth).padStart(2, '0')}`
}

function isToday(date: string): boolean {
  return date === getToday()
}

function hasDiary(date: string): boolean {
  return diaryDates.value.has(date)
}

function hasTodo(date: string): boolean {
  return todoDates.value.has(date)
}

function selectDay(date: string) {
  emit('select', date)
}
</script>
