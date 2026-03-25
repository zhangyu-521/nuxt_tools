export interface Diary {
  id: string
  date: string
  content: string
  mood: 1 | 2 | 3 | 4 | 5
  location?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Todo {
  id: string
  content: string
  date: string
  completed: boolean
  tags: string[]
  createdAt: string
}

export interface MonthStats {
  month: string
  totalTodos: number
  completedTodos: number
  completionRate: number
  avgMood: number
  diaryCount: number
}

export interface AppSettings {
  theme: 'light' | 'dark'
  language: string
}

export interface ExportData {
  version: string
  exportDate: string
  diaries: Diary[]
  todos: Todo[]
}

export interface QueryOptions {
  startDate?: string
  endDate?: string
  tags?: string[]
  limit?: number
  offset?: number
}
