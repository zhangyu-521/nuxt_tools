import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import type { Todo } from '~/types'

export const useTodoStore = defineStore('todo', () => {
  const storage = useStorage()

  // State
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getTodosByDate = computed(() => {
    return (date: string) => todos.value.filter(t => t.date === date)
  })

  const getUncompletedTodos = computed(() => {
    return todos.value.filter(t => !t.completed)
  })

  const getCompletedTodos = computed(() => {
    return todos.value.filter(t => t.completed)
  })

  const allTags = computed(() => {
    const tagSet = new Set<string>()
    todos.value.forEach(todo => {
      todo.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  })

  // Statistics
  const getStatsByMonth = computed(() => {
    return (month: string) => {
      const monthTodos = todos.value.filter(t => t.date.startsWith(month))
      const total = monthTodos.length
      const completed = monthTodos.filter(t => t.completed).length
      return {
        total,
        completed,
        uncompleted: total - completed,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      }
    }
  })

  // Actions
  async function fetchTodos(date?: string) {
    loading.value = true
    error.value = null
    try {
      todos.value = await storage.getTodos(date)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch todos'
    } finally {
      loading.value = false
    }
  }

  async function addTodo(content: string, date: string, tags: string[] = []) {
    loading.value = true
    error.value = null
    try {
      const todo: Todo = {
        id: uuidv4(),
        content: content.trim(),
        date,
        completed: false,
        tags: [...tags],
        createdAt: new Date().toISOString(),
      }

      await storage.saveTodo(todo)
      todos.value.push(todo)
      return todo
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to add todo'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function toggleTodo(id: string) {
    const todo = todos.value.find(t => t.id === id)
    if (!todo) return

    try {
      await storage.updateTodo(id, { completed: !todo.completed })
      todo.completed = !todo.completed
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update todo'
      throw e
    }
  }

  async function updateTodo(id: string, updates: Partial<Todo>) {
    try {
      await storage.updateTodo(id, updates)
      const index = todos.value.findIndex(t => t.id === id)
      if (index >= 0) {
        todos.value[index] = { ...todos.value[index], ...updates }
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update todo'
      throw e
    }
  }

  async function deleteTodo(id: string) {
    try {
      await storage.deleteTodo(id)
      todos.value = todos.value.filter(t => t.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete todo'
      throw e
    }
  }

  async function postponeTodo(id: string, days: number = 1) {
    const todo = todos.value.find(t => t.id === id)
    if (!todo) return

    const newDate = addDays(todo.date, days)
    await updateTodo(id, { date: newDate, completed: false })
  }

  async function postponeUncompletedTodos(fromDate: string, toDate?: string) {
    const targetDate = toDate || addDays(fromDate, 1)
    const uncompleted = todos.value.filter(t => t.date === fromDate && !t.completed)

    for (const todo of uncompleted) {
      await updateTodo(todo.id, { date: targetDate })
    }
  }

  return {
    todos,
    loading,
    error,
    getTodosByDate,
    getUncompletedTodos,
    getCompletedTodos,
    allTags,
    getStatsByMonth,
    fetchTodos,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    postponeTodo,
    postponeUncompletedTodos,
  }
})
