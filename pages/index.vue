<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Welcome -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">
          <span class="gradient-text">{{ greeting }}</span>
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2 text-sm">
          <span class="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
          {{ currentDate }}
        </p>
      </div>
      <NuxtLink :to="todayDiaryLink" class="btn-primary">
        <svg v-if="hasTodayDiary" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        {{ hasTodayDiary ? '查看日记' : '写日记' }}
      </NuxtLink>
    </div>

    <!-- Quick Mood -->
    <div class="card p-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 class="font-semibold text-gray-900 dark:text-gray-100">今日心情</h2>
          <p class="text-xs text-gray-400">记录此刻的感受</p>
        </div>
      </div>
      <DiaryMoodSelector v-model="todayMood" @update:model-value="saveMood" />
    </div>

    <!-- Today's Todos -->
    <div class="card p-6">
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-gray-100">今日待办</h2>
            <p class="text-xs text-gray-400">完成 {{ completedCount }}/{{ todayTodos.length }} 项</p>
          </div>
        </div>
        <div class="w-20 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500" :style="{ width: `${todayTodos.length ? (completedCount / todayTodos.length * 100) : 0}%` }" />
        </div>
      </div>

      <TodoInput @add="addTodo" class="mb-4" />

      <div v-if="todayTodos.length === 0" class="text-center py-12 text-gray-400">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p>还没有待办事项，添加一个吧</p>
      </div>

      <div v-else class="space-y-2">
        <div v-for="todo in todayTodos" :key="todo.id" class="flex items-center gap-3 p-4 bg-white dark:bg-slate-700/30 rounded-xl border border-gray-100 dark:border-slate-700/50 hover:shadow-md transition-all duration-200">
          <button
            @click="todoStore.toggleTodo(todo.id)"
            class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200"
            :class="todo.completed
              ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/20'
              : 'border-gray-300 dark:border-gray-500 hover:border-primary-400'"
          >
            <svg v-if="todo.completed" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </button>

          <div class="flex-1 min-w-0">
            <div :class="todo.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'">
              {{ todo.content }}
            </div>
          </div>

          <button v-if="!todo.completed" @click="confirmPostpone(todo.id)" class="px-3 py-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg transition-all hover:bg-amber-200 dark:hover:bg-amber-900/50">
            延期
          </button>

          <button @click="confirmDelete(todo.id)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

    </div>

    <!-- Confirm Modal (Teleport to body) -->
    <Teleport to="body">
      <div v-if="showConfirmModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" @click.self="cancelConfirm">
        <div class="card p-6 w-full max-w-sm mx-4">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="confirmType === 'delete' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'">
              <svg class="w-5 h-5" :class="confirmType === 'delete' ? 'text-red-600' : 'text-amber-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="confirmType === 'postpone'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100">{{ confirmTitle }}</h3>
          </div>
          <p class="text-sm text-gray-500 mb-6">{{ confirmMessage }}</p>
          <div class="flex gap-3">
            <button @click="cancelConfirm" class="flex-1 px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
              取消
            </button>
            <button @click="executeConfirm" :class="confirmType === 'delete' ? 'btn-danger' : 'btn-primary'" class="flex-1 px-4 py-2.5 rounded-xl font-medium">
              确认
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="stat-card group">
        <div class="w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div class="text-2xl font-bold gradient-text">{{ diaryCount }}</div>
        <div class="text-xs text-gray-400 mt-1">日记篇数</div>
      </div>
      <div class="stat-card group">
        <div class="w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">{{ completionRate }}%</div>
        <div class="text-xs text-gray-400 mt-1">本月完成率</div>
      </div>
      <div class="stat-card group">
        <div class="w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
          </svg>
        </div>
        <div class="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{{ streakDays }}</div>
        <div class="text-xs text-gray-400 mt-1">连续记录</div>
      </div>
      <div class="stat-card group">
        <div class="w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div class="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{{ avgMood }}</div>
        <div class="text-xs text-gray-400 mt-1">平均心情</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDiaryStore } from '~/stores/diary'
import { useTodoStore } from '~/stores/todo'
import { getToday, getCurrentMonth, formatDate, addDays } from '~/utils/date'

const diaryStore = useDiaryStore()
const todoStore = useTodoStore()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const currentDate = formatDate(new Date())
const today = getToday()
const hasTodayDiary = computed(() => !!diaryStore.getDiaryByDate(today))
const todayDiaryLink = computed(() => `/diary/${today}`)
const todayMood = ref(3)

async function saveMood(mood: number) {
  const existing = diaryStore.getDiaryByDate(today)
  await diaryStore.saveDiary({
    id: existing?.id ? String(existing.id) : undefined,
    date: String(today),
    mood: Number(mood),
    content: existing?.content ? String(existing.content) : '',
    tags: existing?.tags ? [...existing.tags.map(String)] : [],
  })
}

const todayTodos = computed(() => todoStore.getTodosByDate(today))
const completedCount = computed(() => todayTodos.value.filter(t => t.completed).length)

// Confirm Modal State
const showConfirmModal = ref(false)
const confirmType = ref<'postpone' | 'delete'>('postpone')
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmTodoId = ref<string | null>(null)

async function addTodo(content: string) {
  await todoStore.addTodo(content, today)
}

function confirmPostpone(id: string) {
  confirmType.value = 'postpone'
  confirmTitle.value = '确认延期'
  confirmMessage.value = '确定要将此待办延期到明天吗？'
  confirmTodoId.value = id
  showConfirmModal.value = true
}

function confirmDelete(id: string) {
  confirmType.value = 'delete'
  confirmTitle.value = '确认删除'
  confirmMessage.value = '确定要删除此待办吗？删除后无法恢复。'
  confirmTodoId.value = id
  showConfirmModal.value = true
}

function cancelConfirm() {
  showConfirmModal.value = false
  confirmTodoId.value = null
}

async function executeConfirm() {
  if (!confirmTodoId.value) return

  try {
    if (confirmType.value === 'postpone') {
      await todoStore.postponeTodo(confirmTodoId.value, 1)
    } else if (confirmType.value === 'delete') {
      await todoStore.deleteTodo(confirmTodoId.value)
    }
  } catch (e) {
    console.error(e)
  } finally {
    cancelConfirm()
  }
}

const diaryCount = computed(() => diaryStore.diaries.length)
const completionRate = computed(() => {
  const stats = todoStore.getStatsByMonth(getCurrentMonth())
  return stats.completionRate
})
const avgMood = computed(() => {
  const diaries = diaryStore.diariesByMonth(getCurrentMonth())
  if (diaries.length === 0) return '-'
  const avg = diaries.reduce((sum, d) => sum + d.mood, 0) / diaries.length
  return avg.toFixed(1)
})
// 计算连续记录天数
const streakDays = computed(() => {
  const diaryDates = [...new Set(diaryStore.diaries.map(d => d.date))].sort().reverse()
  if (diaryDates.length === 0) return 0

  const today = getToday()
  const yesterday = addDays(today, -1)

  // 检查今天或昨天是否有记录（作为连续起点）
  let startDate: string
  if (diaryDates.includes(today)) {
    startDate = today
  } else if (diaryDates.includes(yesterday)) {
    startDate = yesterday
  } else {
    // 今天和昨天都没记录，连续天数为0
    return 0
  }

  // 从起点往前数连续天数
  let streak = 1
  let checkDate = startDate

  while (true) {
    const prevDate = addDays(checkDate, -1)
    if (diaryDates.includes(prevDate)) {
      streak++
      checkDate = prevDate
    } else {
      break
    }
  }

  return streak
})

onMounted(async () => {
  await diaryStore.fetchDiaries()
  await todoStore.fetchTodos()
  const todayDiary = diaryStore.getDiaryByDate(today)
  if (todayDiary) {
    todayMood.value = todayDiary.mood
  }
})
</script>
