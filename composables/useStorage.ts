import type { Diary, DiaryImage, Todo, QueryOptions, ExportData } from '~/types'
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

  // Images
  getImage(id: string): Promise<DiaryImage | null>
  getImagesByDiary(diaryId: string): Promise<DiaryImage[]>
  saveImage(image: DiaryImage): Promise<void>
  deleteImage(id: string): Promise<void>
  deleteImagesByDiary(diaryId: string): Promise<void>

  // Export/Import
  exportAll(): Promise<ExportData>
  importAll(data: ExportData): Promise<void>
}

// IndexedDB implementation
class IndexedDBStorage implements StorageAdapter {
  async getDiary(id: string): Promise<Diary | null> {
    const db = await getDB()
    return (await db.get('diaries', id)) ?? null
  }

  async getDiaryByDate(date: string): Promise<Diary | null> {
    const db = await getDB()
    const index = db.transaction('diaries').store.index('by-date')
    return (await index.get(date)) ?? null
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
    return (await db.get('todos', id)) ?? null
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

  // Images
  async getImage(id: string): Promise<DiaryImage | null> {
    const db = await getDB()
    return (await db.get('images', id)) ?? null
  }

  async getImagesByDiary(diaryId: string): Promise<DiaryImage[]> {
    const db = await getDB()
    const index = db.transaction('images').store.index('by-diary')
    return await index.getAll(diaryId)
  }

  async saveImage(image: DiaryImage): Promise<void> {
    const db = await getDB()
    const plainImage = JSON.parse(JSON.stringify(image))
    await db.put('images', plainImage)
  }

  async deleteImage(id: string): Promise<void> {
    const db = await getDB()
    await db.delete('images', id)
  }

  async deleteImagesByDiary(diaryId: string): Promise<void> {
    const db = await getDB()
    const images = await this.getImagesByDiary(diaryId)
    const tx = db.transaction('images', 'readwrite')
    for (const image of images) {
      await tx.store.delete(image.id)
    }
    await tx.done
  }

  async exportAll(): Promise<ExportData> {
    const [diaries, todos] = await Promise.all([
      this.getDiaries(),
      this.getTodos()
    ])

    // 收集所有日记相关的图片
    const imageIds = new Set<string>()
    for (const diary of diaries) {
      if (diary.images) {
        for (const imageId of diary.images) {
          imageIds.add(imageId)
        }
      }
    }

    // 获取所有图片数据
    const images: DiaryImage[] = []
    for (const imageId of imageIds) {
      const image = await this.getImage(imageId)
      if (image) {
        images.push(image)
      }
    }

    return {
      version: '2.0.0',
      exportDate: new Date().toISOString(),
      diaries,
      todos,
      images,
    }
  }

  async importAll(data: ExportData): Promise<void> {
    const db = await getDB()
    const tx = db.transaction(['diaries', 'todos', 'images'], 'readwrite')

    // 导入日记
    for (const diary of data.diaries) {
      await tx.objectStore('diaries').put(diary)
    }

    // 导入待办
    for (const todo of data.todos) {
      await tx.objectStore('todos').put(todo)
    }

    // 导入图片（如果存在）
    if (data.images) {
      for (const image of data.images) {
        await tx.objectStore('images').put(image)
      }
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
