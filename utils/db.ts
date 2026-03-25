import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Diary, Todo } from '~/types'

interface DiaryDB extends DBSchema {
  diaries: {
    key: string
    value: Diary
    indexes: {
      'by-date': string
      'by-tags': string
    }
  }
  todos: {
    key: string
    value: Todo
    indexes: {
      'by-date': string
      'by-completed': string
      'by-tags': string
    }
  }
}

const DB_NAME = 'DiaryApp'
const DB_VERSION = 1

let db: IDBPDatabase<DiaryDB> | null = null

export async function initDB(): Promise<IDBPDatabase<DiaryDB>> {
  if (db) return db

  db = await openDB<DiaryDB>(DB_NAME, DB_VERSION, {
    upgrade(database) {
      // Diaries store
      if (!database.objectStoreNames.contains('diaries')) {
        const diaryStore = database.createObjectStore('diaries', { keyPath: 'id' })
        diaryStore.createIndex('by-date', 'date', { unique: false })
        diaryStore.createIndex('by-tags', 'tags', { unique: false, multiEntry: true })
      }

      // Todos store
      if (!database.objectStoreNames.contains('todos')) {
        const todoStore = database.createObjectStore('todos', { keyPath: 'id' })
        todoStore.createIndex('by-date', 'date', { unique: false })
        todoStore.createIndex('by-completed', 'completed', { unique: false })
        todoStore.createIndex('by-tags', 'tags', { unique: false, multiEntry: true })
      }
    },
  })

  return db
}

export async function getDB(): Promise<IDBPDatabase<DiaryDB>> {
  if (!db) {
    db = await initDB()
  }
  return db
}
