<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold gradient-text">待办事项</h1>
      </div>
      <button @click="showPostponeModal = true" class="text-sm text-primary-600 hover:text-primary-700 font-medium">
        批量延期
      </button>
    </div>

    <!-- Date Filter -->
    <div class="flex items-center gap-3">
      <div class="relative">
        <input v-model="selectedDate" type="date" class="input pl-11 pr-4" />
        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      <button @click="selectedDate = today" class="px-4 py-2 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium text-sm hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors">
        今天
      </button>
      <button @click="selectedDate = ''" class="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 text-sm transition-colors">
        全部
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4">
      <div class="stat-card">
        <div class="w-10 h-10 mx-auto mb-2 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ filteredTodos.length }}</div>
        <div class="text-xs text-gray-400">总待办</div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">{{ completedCount }}</div>
        <div class="text-xs text-gray-400">已完成</div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 mx-auto mb-2 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{{ uncompletedCount }}</div>
        <div class="text-xs text-gray-400">未完成</div>
      </div>
    </div>

    <!-- Add Todo -->
    <div class="card p-5">
      <TodoInput @add="addTodo" />
    </div>

    <!-- Todo List -->
    <div class="card divide-y divide-gray-100 dark:divide-slate-700/50">
      <div v-if="filteredTodos.length === 0" class="p-12 text-center text-gray-400">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p>没有待办事项</p>
      </div>

      <div v-for="todo in sortedTodos" :key="todo.id" class="p-4 flex items-center gap-3 group hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
        <button
          @click="todoStore.toggleTodo(todo.id)"
          class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all"
          :class="todo.completed
            ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 border-emerald-500'
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
          <div class="text-xs text-gray-400 mt-0.5">
            {{ todo.date }}
            <span v-if="todo.tags.length > 0" class="ml-2">{{ todo.tags.join(', ') }}</span>
          </div>
        </div>

        <button v-if="!todo.completed" @click="postponeTodo(todo.id)" class="opacity-0 group-hover:opacity-100 px-3 py-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg transition-all hover:bg-amber-200 dark:hover:bg-amber-900/50">
          延期
        </button>

        <button @click="todoStore.deleteTodo(todo.id)" class="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Postpone Modal -->
    <div v-if="showPostponeModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" @click.self="showPostponeModal = false">
      <div class="card p-6 w-full max-w-sm mx-4">
        <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-4">批量延期</h3>
        <p class="text-sm text-gray-500 mb-4">将 {{ selectedDate || '所有' }} 日期的未完成待办延期到：</p>
        <input v-model="postponeTargetDate" type="date" class="input mb-4" />
        <div class="flex gap-3">
          <button @click="showPostponeModal = false" class="flex-1 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            取消
          </button>
          <button @click="confirmPostpone" class="flex-1 px-4 py-2.5 btn-primary">
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTodoStore } from '~/stores/todo'
import { getToday } from '~/utils/date'

const todoStore = useTodoStore()

const today = getToday()
const selectedDate = ref(today)
const showPostponeModal = ref(false)
const postponeTargetDate = ref(getToday())

const filteredTodos = computed(() => {
  if (!selectedDate.value) {
    return todoStore.todos
  }
  return todoStore.todos.filter(t => t.date === selectedDate.value)
})

const sortedTodos = computed(() => {
  return [...filteredTodos.value].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})

const completedCount = computed(() => filteredTodos.value.filter(t => t.completed).length)
const uncompletedCount = computed(() => filteredTodos.value.filter(t => !t.completed).length)

async function addTodo(content: string) {
  const date = selectedDate.value || today
  await todoStore.addTodo(content, date)
}

async function postponeTodo(id: string) {
  await todoStore.postponeTodo(id, 1)
}

async function confirmPostpone() {
  if (!postponeTargetDate.value) return
  await todoStore.postponeUncompletedTodos(selectedDate.value, postponeTargetDate.value)
  showPostponeModal.value = false
}

onMounted(() => {
  todoStore.fetchTodos()
})
</script>
