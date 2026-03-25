import type { Diary, Todo, QueryOptions, ExportData } from '~/types'
import { getDB } from '~/utils/db'

export interface StorageAdapter {
  // Diary
  getDiary(id: string): Promise<Diary | null>
  getDiaryByDate(date: string): Promise<Diary | null>
  getDiaries(options?: QueryOptions): Promise<Diary[]>
  saveDiary(diary: Diary): Promise<void>
  deleteDiary(id: string): Promise<void>
  searchDiaries(query: string): Promise<Diary[]>

  // Todo
  getTodo(id: string): Promise<Todo | null>
  getTodos(date?: string): Promise<Todo[]>
  getTodosByDateRange(startDate: string, endDate: string): Promise<Todo[]>
  saveTodo(todo: Todo): Promise<void>
  updateTodo(id: string, updates: Partial<Todo>): Promise<void>
  deleteTodo(id: string): Promise<void>

  // Export/Import
  exportAll(): Promise<ExportData>
  importAll(data: ExportData): Promise<void>
}

// IndexedDB implementation
class IndexedDBStorage implements StorageAdapter {
  async getDiary(id: string): Promise<Diary | null> {
    const db = await getDB()
    return await db.get('diaries', id)
  }

  async getDiaryByDate(date: string): Promise<Diary | null> {
    const db = await getDB()
    const index = db.transaction('diaries').store.index('by-date')
    return await index.get(date)
  }

  async getDiaries(options?: QueryOptions): Promise<Diary[]> {
    const db = await getDB()
    const tx = db.transaction('diaries', 'readonly')
    const store = tx.store

    let diaries: Diary[] = []

    if (options?.startDate && options?.endDate) {
      const index = store.index('by-date')
      const range = IDBKeyRange.bound(options.startDate, options.endDate)
      diaries = await index.getAll(range)
    } else {
      diaries = await store.getAll()
    }

    await tx.done

    // Filter by tags if specified
    if (options?.tags && options.tags.length > 0) {
      diaries = diaries.filter(diary =>
        options.tags!.some(tag => diary.tags.includes(tag))
      )
    }

    // Sort by date descending
    diaries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Apply pagination
    if (options?.offset !== undefined && options?.limit !== undefined) {
      diaries = diaries.slice(options.offset, options.offset + options.limit)
    }

    return diaries
  }

  async saveDiary(diary: Diary): Promise<void> {
    const db = await getDB()
    // Convert to plain object to ensure IndexedDB can clone it
    const plainDiary = JSON.parse(JSON.stringify(diary))
    await db.put('diaries', plainDiary)
  }

  async deleteDiary(id: string): Promise<void> {
    const db = await getDB()
    await db.delete('diaries', id)
  }

  async searchDiaries(query: string): Promise<Diary[]> {
    const diaries = await this.getDiaries()
    const lowerQuery = query.toLowerCase()
    return diaries.filter(diary =>
      diary.content.toLowerCase().includes(lowerQuery) ||
      diary.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  async getTodo(id: string): Promise<Todo | null> {
    const db = await getDB()
    return await db.get('todos', id)
  }

  async getTodos(date?: string): Promise<Todo[]> {
    const db = await getDB()

    if (date) {
      const index = db.transaction('todos').store.index('by-date')
      const todos = await index.getAll(date)
      return todos.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    }

    const todos = await db.getAll('todos')
    return todos.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }

  async getTodosByDateRange(startDate: string, endDate: string): Promise<Todo[]> {
    const db = await getDB()
    const index = db.transaction('todos').store.index('by-date')
    const range = IDBKeyRange.bound(startDate, endDate)
    return await index.getAll(range)
  }

  async saveTodo(todo: Todo): Promise<void> {
    const db = await getDB()
    // Convert to plain object to ensure IndexedDB can clone it
    const plainTodo = JSON.parse(JSON.stringify(todo))
    await db.put('todos', plainTodo)
  }

  async updateTodo(id: string, updates: Partial<Todo>): Promise<void> {
    const db = await getDB()
    const todo = await db.get('todos', id)
    if (todo) {
      const plainUpdates = JSON.parse(JSON.stringify(updates))
      await db.put('todos', { ...todo, ...plainUpdates })
    }
  }

  async deleteTodo(id: string): Promise<void> {
    const db = await getDB()
    await db.delete('todos', id)
  }

  async exportAll(): Promise<ExportData> {
    const [diaries, todos] = await Promise.all([
      this.getDiaries(),
      this.getTodos()
    ])

    return {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      diaries,
      todos,
    }
  }

  async importAll(data: ExportData): Promise<void> {
    const db = await getDB()

    const tx = db.transaction(['diaries', 'todos'], 'readwrite')

    // Clear existing data
    await tx.objectStore('diaries').clear()
    await tx.objectStore('todos').clear()

    // Import new data
    for (const diary of data.diaries) {
      await tx.objectStore('diaries').put(diary)
    }

    for (const todo of data.todos) {
      await tx.objectStore('todos').put(todo)
    }

    await tx.done
  }
}

// Singleton instance
let storageInstance: StorageAdapter | null = null

export function useStorage(): StorageAdapter {
  if (!storageInstance) {
    storageInstance = new IndexedDBStorage()
  }
  return storageInstance
}
