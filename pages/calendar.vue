<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/20">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold gradient-text">日历</h1>
    </div>

    <!-- Calendar Card -->
    <div class="card p-6">
      <CalendarGrid :diaries="diaryStore.diaries" :todos="todoStore.todos" @select="onDaySelect" />

      <!-- Legend -->
      <div class="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100 dark:border-slate-700/50">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-gradient-to-r from-primary-400 to-primary-500" />
          <span class="text-sm text-gray-600 dark:text-gray-400">有日记</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" />
          <span class="text-sm text-gray-600 dark:text-gray-400">有待办</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-gradient-to-r from-primary-500 to-emerald-500" />
          <span class="text-sm text-gray-600 dark:text-gray-400">两者都有</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDiaryStore } from '~/stores/diary'
import { useTodoStore } from '~/stores/todo'

const diaryStore = useDiaryStore()
const todoStore = useTodoStore()
const router = useRouter()

function onDaySelect(date: string) {
  router.push(`/diary/${date}`)
}

onMounted(() => {
  diaryStore.fetchDiaries()
  todoStore.fetchTodos()
})
</script>
