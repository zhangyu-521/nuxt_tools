<template>
  <div class="flex items-center gap-3 p-4 bg-white dark:bg-slate-700/30 rounded-xl border border-gray-100 dark:border-slate-700/50 group hover:shadow-md transition-all duration-200">
    <button
      @click="$emit('toggle', todo.id)"
      class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200"
      :class="todo.completed
        ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/20'
        : 'border-gray-300 dark:border-gray-500 hover:border-primary-400'"
    >
      <svg
        v-if="todo.completed"
        class="w-4 h-4 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
      </svg>
    </button>

    <span
      class="flex-1 text-sm transition-all duration-200"
      :class="todo.completed
        ? 'line-through text-gray-400'
        : 'text-gray-700 dark:text-gray-200'"
    >
      {{ todo.content }}
    </span>

    <button
      @click="$emit('delete', todo.id)"
      class="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '~/types'

interface Props {
  todo: Todo
}

interface Emits {
  (e: 'toggle', id: string): void
  (e: 'delete', id: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
