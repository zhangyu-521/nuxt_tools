import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import type { Diary, QueryOptions } from '~/types'

export const useDiaryStore = defineStore('diary', () => {
  const storage = useStorage()

  // State
  const diaries = ref<Diary[]>([])
  const currentDiary = ref<Diary | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getDiaryByDate = computed(() => {
    return (date: string) => diaries.value.find(d => d.date === date)
  })

  const allTags = computed(() => {
    const tagSet = new Set<string>()
    diaries.value.forEach(diary => {
      diary.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  })

  const diariesByMonth = computed(() => {
    return (month: string) => {
      return diaries.value.filter(d => d.date.startsWith(month))
    }
  })

  // Actions
  async function fetchDiaries(options?: QueryOptions) {
    loading.value = true
    error.value = null
    try {
      diaries.value = await storage.getDiaries(options)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch diaries'
    } finally {
      loading.value = false
    }
  }

  async function fetchDiaryByDate(date: string) {
    loading.value = true
    error.value = null
    try {
      currentDiary.value = await storage.getDiaryByDate(date)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch diary'
    } finally {
      loading.value = false
    }
  }

  async function saveDiary(data: Partial<Diary>) {
    loading.value = true
    error.value = null
    try {
      const now = new Date().toISOString()
      const diaryData: Diary = {
        id: data.id || uuidv4(),
        date: data.date || getToday(),
        content: data.content || '',
        mood: data.mood || 3,
        location: data.location,
        tags: data.tags ? [...data.tags] : [],
        images: data.images ? [...data.images] : [],
        createdAt: data.createdAt || now,
        updatedAt: now,
      }

      await storage.saveDiary(diaryData)
      currentDiary.value = diaryData

      // Update local list
      const index = diaries.value.findIndex(d => d.id === diaryData.id)
      if (index >= 0) {
        diaries.value[index] = diaryData
      } else {
        diaries.value.unshift(diaryData)
      }

      return diaryData
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to save diary'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteDiary(id: string) {
    loading.value = true
    error.value = null
    try {
      await storage.deleteDiary(id)
      diaries.value = diaries.value.filter(d => d.id !== id)
      if (currentDiary.value?.id === id) {
        currentDiary.value = null
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete diary'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function searchDiaries(query: string) {
    loading.value = true
    error.value = null
    try {
      return await storage.searchDiaries(query)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to search diaries'
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    diaries,
    currentDiary,
    loading,
    error,
    getDiaryByDate,
    allTags,
    diariesByMonth,
    fetchDiaries,
    fetchDiaryByDate,
    saveDiary,
    deleteDiary,
    searchDiaries,
  }
})
